import { CacheService } from "@app/common/cache/cache.service";
import { DatabaseService } from "@app/common/database/database.service";
import {
  GetGeneralRecipesResponse,
  RECIPE_INGR_INDEX,
} from "@app/crawler/recipe/recipe";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Recipes } from "@prisma/client";
import axios, { AxiosRequestConfig } from "axios";
import { omit } from "lodash";

@Injectable()
export class RecipeCron {
  private readonly logger = new Logger(RecipeCron.name);
  private is_crawling_general_recipes = false;
  private is_crawling_detail_recipes = false;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async crawlDetailRecipes() {
    if (this.is_crawling_detail_recipes) {
      this.logger.log(
        "Crawling detail recipes already in progress. Stop this crawling session.",
      );
      return;
    }
    this.is_crawling_detail_recipes = true;
    try {
      this.logger.log("Crawling detail recipes");
      const url = this.configService.get<string>("SUPERCOOK_CRAWLER_URL");
      const request_config: AxiosRequestConfig = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${url}/dyn/details`,
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          rid: "d066192d6a917bfa796bef94e5227628",
        },
        timeout: 10000,
      };
      const response = await axios.request(request_config);
      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
      this.logger.error(error);
      throw error;
    } finally {
      this.is_crawling_detail_recipes = false;
    }
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  async crawlGeneralRecipes() {
    if (this.is_crawling_general_recipes) {
      this.logger.log(
        "Crawling general recipes already in progress. Stop this crawling session.",
      );
      return;
    }
    this.is_crawling_general_recipes = true;
    try {
      this.logger.log("Crawling recipes");
      const recipe_ingr_index = await this.cacheService.getData<number>({
        key: RECIPE_INGR_INDEX,
      });
      if (!recipe_ingr_index) {
        throw new Error("Please set a default recipe ingredient index key");
      }
      const ingredients = await this.databaseService.ingredients.findMany({
        skip: recipe_ingr_index,
        take: 10,
        orderBy: {
          id: "asc",
        },
      });
      for (const ingredient of ingredients) {
        let crawled_retry = 0;
        this.logger.log(`Crawling recipes for ${ingredient.name}`);
        let start = 0;
        const url = this.configService.get<string>("SUPERCOOK_CRAWLER_URL");
        while (true) {
          if (start > 300) {
            break;
          }
          if (crawled_retry === 3) {
            break;
          }
          try {
            const request_config: AxiosRequestConfig = {
              method: "post",
              maxBodyLength: Infinity,
              url: `${url}/dyn/results`,
              headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded",
              },
              data: {
                needsimage: 1,
                kitchen: ingredient.name,
                start: start,
              },
              timeout: 10000,
            };
            const response =
              await axios.request<GetGeneralRecipesResponse>(request_config);
            if (response.status !== 200) {
              this.logger.error(`Unexpected status code: ${response.status}`);
              break;
            }

            const { data } = response;
            if (data.results.length === 0) {
              this.logger.log(`Retry ${crawled_retry} for ${ingredient.name}`);
              crawled_retry++;
            } else {
              start = data.start + data.results.length;
              for (const result of data.results) {
                const recipe: Pick<
                  Recipes,
                  "id" | "title" | "image_url" | "domain"
                > = {
                  id: result.id,
                  title: result.title,
                  image_url: result.img,
                  domain: result.domain,
                };
                await this.databaseService.recipes.upsert({
                  where: { id: recipe.id },
                  update: { ...omit(recipe, ["id"]) },
                  create: { ...recipe },
                });

                const ingredients =
                  await this.databaseService.ingredients.findMany({
                    where: {
                      name: { in: [result.uses, ...result.needs] },
                    },
                  });
                await this.databaseService.recipeIngredients.createMany({
                  data: ingredients.map((ingredient) => ({
                    recipe_id: recipe.id,
                    ingredient_id: ingredient.id,
                  })),
                  skipDuplicates: true,
                });
                this.logger.log(
                  `Added ${result.title} recipe with id ${result.id}`,
                );
              }
              this.logger.log(
                `Crawled ${data.results.length} recipes for ingredient ${ingredient.name} at start = ${data.start}`,
              );
            }
          } catch (error) {
            if (error.code === "ECONNRESET") {
              this.logger.warn(
                `Socket hang up for ${ingredient.name}. Retrying...`,
              );
              crawled_retry++;
            } else {
              this.logger.error(
                `Error crawling recipes for ${ingredient.name}:`,
                error,
              );
              break;
            }
          }
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      await this.cacheService.setData({
        key: RECIPE_INGR_INDEX,
        value: recipe_ingr_index + 10,
      });
    } catch (error) {
      console.log(error);
      this.logger.error(error);
      throw error;
    } finally {
      this.is_crawling_general_recipes = false;
    }
  }
}
