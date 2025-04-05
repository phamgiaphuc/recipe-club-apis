import { DatabaseService } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron, CronExpression } from "@nestjs/schedule";
import { IngredientGroups, Ingredients } from "@prisma/client";
import {
  IngredienGroupResponse,
  IngredientNutritionResponse,
} from "apps/crawler/src/ingredient/types/ingredient";
import { GetIngredientNutrientsResponse } from "apps/crawler/src/ingredient/types/nutrient";
import axios from "axios";
import { omit } from "lodash";

@Injectable()
export class IngredientCron {
  private readonly logger = new Logger(IngredientCron.name);
  private is_crawling_ingredients = false;
  private is_crawling_ingredient_nutritions = false;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // async crawlIngredientNutritionsV2() {
  //   /**
  //    * Only one crawling session is allowed at a time
  //    */
  //   if (this.is_crawling_ingredient_nutritions) {
  //     this.logger.log(
  //       "Crawling ingredient nutritions already in progress. Stop this crawling session.",
  //     );
  //     return;
  //   }
  //   this.is_crawling_ingredient_nutritions = true;
  //   try {
  //     this.logger.log("Crawling ingredient nutritions V2");
  //     const ingredients = await this.databaseService.ingredients.findMany({
  //       where: {
  //         is_nutrition_updated: false,
  //       },
  //       orderBy: {
  //         id: "asc",
  //       },
  //     });
  //     for (const ingredient of ingredients) {
  //       this.logger.log(`Crawling nutrients for ${ingredient.name}`);
  //       const search_params = new URLSearchParams({
  //         ingr: `100g ${ingredient.name}`,
  //       });
  //       const response = await axios.get<GetIngredientNutrientsResponse>(
  //         `https://edamam-edamam-nutrition-analysis.p.rapidapi.com/api/nutrition-data?nutrition-type=cooking&${search_params.toString()}`,
  //         {
  //           headers: {
  //             "x-rapidapi-host":
  //               "edamam-edamam-nutrition-analysis.p.rapidapi.com",
  //             "x-rapidapi-key":
  //               "4e934bd05cmshe7242904f3c45a9p132089jsnc86b4cf3c33e",
  //           },
  //         },
  //       );
  //       const {
  //         data: { totalNutrients },
  //       } = response;
  //       await this.databaseService.ingredients.update({
  //         where: {
  //           id: ingredient.id,
  //         },
  //         data: {
  //           serving_size_g: 100,
  //           calories_kcal: totalNutrients?.ENERC_KCAL?.quantity ?? null,
  //           fat_total_g: totalNutrients?.FAT?.quantity ?? null,
  //           fat_saturated_g: totalNutrients?.FASAT?.quantity ?? null,
  //           fat_monounsaturated_g: totalNutrients?.FAMS?.quantity ?? null,
  //           fat_polyunsaturated_g: totalNutrients?.FAPU?.quantity ?? null,
  //           fat_trans_g: totalNutrients?.FATRN?.quantity ?? null,
  //           protein_g: totalNutrients?.PROCNT?.quantity ?? null,
  //           sodium_mg: totalNutrients?.NA?.quantity ?? null,
  //           calcium_mg: totalNutrients?.CA?.quantity ?? null,
  //           magnesium_mg: totalNutrients?.MG?.quantity ?? null,
  //           potassium_mg: totalNutrients?.K?.quantity ?? null,
  //           cholesterol_mg: totalNutrients?.CHOLE?.quantity ?? null,
  //           iron_mg: totalNutrients?.FE?.quantity ?? null,
  //           zinc_mg: totalNutrients?.ZN?.quantity ?? null,
  //           phosphorus_mg: totalNutrients?.P?.quantity ?? null,
  //           carbohydrates_total_g: totalNutrients?.CHOCDF?.quantity ?? null,
  //           fiber_g: totalNutrients?.FIBTG?.quantity ?? null,
  //           sugar_g: totalNutrients?.SUGAR?.quantity ?? null,
  //           vitamin_a_ug: totalNutrients?.VITA_RAE?.quantity ?? null,
  //           vitamin_c_mg: totalNutrients?.VITC?.quantity ?? null,
  //           vitamin_b1_mg: totalNutrients?.THIA?.quantity ?? null,
  //           vitamin_b2_mg: totalNutrients?.RIBF?.quantity ?? null,
  //           vitamin_b3_mg: totalNutrients?.NIA?.quantity ?? null,
  //           vitamin_b6_mg: totalNutrients?.VITB6A?.quantity ?? null,
  //           folate_dfe_ug: totalNutrients?.FOLDFE?.quantity ?? null,
  //           folate_food_ug: totalNutrients?.FOLFD?.quantity ?? null,
  //           folic_acid_ug: totalNutrients?.FOLAC?.quantity ?? null,
  //           vitamin_b12_ug: totalNutrients?.VITB12?.quantity ?? null,
  //           vitamin_d_ug: totalNutrients?.VITD?.quantity ?? null,
  //           vitamin_e_mg: totalNutrients?.TOCPHA?.quantity ?? null,
  //           vitamin_k_ug: totalNutrients?.VITK1?.quantity ?? null,
  //           water_g: totalNutrients?.WATER?.quantity ?? null,
  //           diets: response.data.dietLabels ?? [],
  //           healths: response.data.healthLabels ?? [],
  //           is_nutrition_updated: true,
  //           nutrition_last_updated: new Date(),
  //         },
  //       });
  //       await new Promise((resolve) => setTimeout(resolve, 5000));
  //     }
  //     this.logger.log("Crawled ingredient nutritions V2 successfully");
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw error;
  //   } finally {
  //     this.is_crawling_ingredient_nutritions = false;
  //   }
  // }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // async crawlIngredientNutritionsV1() {
  //   /**
  //    * Only one crawling session is allowed at a time
  //    */
  //   if (this.is_crawling_ingredients) {
  //     this.logger.log(
  //       "Crawling ingredient nutritions already in progress. Stop this crawling session.",
  //     );
  //     return;
  //   }
  //   this.is_crawling_ingredients = true;
  //   try {
  //     this.logger.log("Crawling ingredient nutritions");
  //     const x_api_key = this.configService.getOrThrow<string>(
  //       "CALORIES_NINJAS_X_API_KEY",
  //     );
  //     const url = `${this.configService.getOrThrow<string>(
  //       "CALORIES_NINJAS_URL",
  //     )}/v1/nutrition`;
  //     const total_ingredients = await this.databaseService.ingredients.count({
  //       where: {
  //         is_nutrition_updated: false,
  //       },
  //     });
  //     if (total_ingredients === 0) {
  //       this.is_crawling_ingredients = false;
  //       this.logger.log("No ingredients to crawl nutritions");
  //       return;
  //     }
  //     const batch_size = 20;
  //     const total_batches = Math.ceil(total_ingredients / batch_size);
  //     for (let i = 0; i < total_batches; i++) {
  //       this.logger.log(
  //         `Crawling batch ${i + 1} of ${total_batches} in ingredient nutritions`,
  //       );
  //       let ingredients = await this.databaseService.ingredients.findMany({
  //         take: batch_size,
  //         skip: i * batch_size,
  //         where: {
  //           is_nutrition_updated: false,
  //         },
  //       });
  //       const search_params = new URLSearchParams({
  //         query: ingredients.map((ingredient) => ingredient.name).join(", "),
  //       });
  //       const crawler_url = `${url}?${search_params.toString()}`;
  //       const {
  //         data: { items },
  //       } = await axios.get<IngredientNutritionResponse>(crawler_url, {
  //         headers: {
  //           "X-Api-Key": x_api_key,
  //         },
  //       });
  //       ingredients = ingredients.map((ingredient) => {
  //         const nutrition = items.find(
  //           (item) => item.name.toLowerCase() === ingredient.name.toLowerCase(),
  //         );
  //         if (nutrition) {
  //           return {
  //             ...ingredient,
  //             calories_kcal: nutrition.calories,
  //             serving_size_g: nutrition.serving_size_g,
  //             fat_total_g: nutrition.fat_total_g,
  //             fat_saturated_g: nutrition.fat_saturated_g,
  //             protein_g: nutrition.protein_g,
  //             sodium_mg: nutrition.sodium_mg,
  //             potassium_mg: nutrition.potassium_mg,
  //             cholesterol_mg: nutrition.cholesterol_mg,
  //             carbohydrates_total_g: nutrition.carbohydrates_total_g,
  //             fiber_g: nutrition.fiber_g,
  //             sugar_g: nutrition.sugar_g,
  //             is_nutrition_updated: true,
  //             nutrition_last_updated: new Date(),
  //           };
  //         }
  //         return ingredient;
  //       });
  //       for (const ingredient of ingredients) {
  //         if (ingredient.is_nutrition_updated) {
  //           await this.databaseService.ingredients.update({
  //             where: {
  //               id: ingredient.id,
  //             },
  //             data: {
  //               ...omit(ingredient, ["id", "updated_at"]),
  //             },
  //           });
  //         }
  //       }
  //     }
  //     this.logger.log(
  //       `Crawled nutritions for ${total_ingredients} ingredients`,
  //     );
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw error;
  //   } finally {
  //     this.is_crawling_ingredients = false;
  //   }
  // }

  // @Cron(CronExpression.EVERY_12_HOURS)
  // async crawlIngredients() {
  //   if (this.is_crawling_ingredients) {
  //     this.logger.log(
  //       "Crawling ingredients already in progress. Stop this crawling session.",
  //     );
  //     return;
  //   }
  //   this.is_crawling_ingredients = true;

  //   try {
  //     this.logger.log("Crawling ingredients");
  //     const crawler_url = `${this.configService.getOrThrow<string>("SUPERCOOK_CRAWLER_URL")}/dyn/lang_ings`;
  //     const { data } = await axios.post<IngredienGroupResponse[]>(crawler_url, {
  //       lang: "en",
  //     });

  //     for (const group of data) {
  //       let ingredient_category =
  //         await this.databaseService.ingredientCategories.findUnique({
  //           where: { name: group.group_name },
  //           include: { group: true },
  //         });

  //       if (!ingredient_category) {
  //         ingredient_category =
  //           await this.databaseService.ingredientCategories.create({
  //             data: { name: group.group_name },
  //             include: { group: true },
  //           });
  //       }

  //       if (ingredient_category.group.length === group.ingredients.length) {
  //         this.logger.log(
  //           `Ingredient category ${group.group_name} already has ${group.ingredients.length} ingredients`,
  //         );
  //         continue;
  //       }

  //       const ingredient_groups: IngredientGroups[] = [];

  //       for (const ingredient_name of group.ingredients) {
  //         this.logger.log(`Crawling nutrients for ${ingredient_name}`);

  //         let nutrients: Partial<Ingredients> = {
  //           is_nutrition_updated: false,
  //         };
  //         const search_params = new URLSearchParams({
  //           ingr: `100g ${ingredient_name}`,
  //         });
  //         const nutrient_crawler_url = `${this.configService.get<string>("EDAMAM_CRAWLER_URL")}&${search_params.toString()}`;

  //         try {
  //           const response =
  //             await axios.get<GetIngredientNutrientsResponse>(
  //               nutrient_crawler_url,
  //             );
  //           if (response.status === 200) {
  //             const { totalNutrients } = response.data;
  //             nutrients = {
  //               serving_size_g: 100,
  //               calories_kcal: totalNutrients?.ENERC_KCAL?.quantity ?? null,
  //               fat_total_g: totalNutrients?.FAT?.quantity ?? null,
  //               fat_saturated_g: totalNutrients?.FASAT?.quantity ?? null,
  //               fat_monounsaturated_g: totalNutrients?.FAMS?.quantity ?? null,
  //               fat_polyunsaturated_g: totalNutrients?.FAPU?.quantity ?? null,
  //               fat_trans_g: totalNutrients?.FATRN?.quantity ?? null,
  //               protein_g: totalNutrients?.PROCNT?.quantity ?? null,
  //               sodium_mg: totalNutrients?.NA?.quantity ?? null,
  //               calcium_mg: totalNutrients?.CA?.quantity ?? null,
  //               magnesium_mg: totalNutrients?.MG?.quantity ?? null,
  //               potassium_mg: totalNutrients?.K?.quantity ?? null,
  //               cholesterol_mg: totalNutrients?.CHOLE?.quantity ?? null,
  //               iron_mg: totalNutrients?.FE?.quantity ?? null,
  //               zinc_mg: totalNutrients?.ZN?.quantity ?? null,
  //               phosphorus_mg: totalNutrients?.P?.quantity ?? null,
  //               carbohydrates_total_g: totalNutrients?.CHOCDF?.quantity ?? null,
  //               fiber_g: totalNutrients?.FIBTG?.quantity ?? null,
  //               sugar_g: totalNutrients?.SUGAR?.quantity ?? null,
  //               vitamin_a_ug: totalNutrients?.VITA_RAE?.quantity ?? null,
  //               vitamin_c_mg: totalNutrients?.VITC?.quantity ?? null,
  //               vitamin_b1_mg: totalNutrients?.THIA?.quantity ?? null,
  //               vitamin_b2_mg: totalNutrients?.RIBF?.quantity ?? null,
  //               vitamin_b3_mg: totalNutrients?.NIA?.quantity ?? null,
  //               vitamin_b6_mg: totalNutrients?.VITB6A?.quantity ?? null,
  //               folate_dfe_ug: totalNutrients?.FOLDFE?.quantity ?? null,
  //               folate_food_ug: totalNutrients?.FOLFD?.quantity ?? null,
  //               folic_acid_ug: totalNutrients?.FOLAC?.quantity ?? null,
  //               vitamin_b12_ug: totalNutrients?.VITB12?.quantity ?? null,
  //               vitamin_d_ug: totalNutrients?.VITD?.quantity ?? null,
  //               vitamin_e_mg: totalNutrients?.TOCPHA?.quantity ?? null,
  //               vitamin_k_ug: totalNutrients?.VITK1?.quantity ?? null,
  //               water_g: totalNutrients?.WATER?.quantity ?? null,
  //               diets: response.data.dietLabels ?? [],
  //               healths: response.data.healthLabels ?? [],
  //               is_nutrition_updated: true,
  //               nutrition_last_updated: new Date(),
  //             };
  //           }
  //         } catch (error) {
  //           this.logger.error(
  //             `Failed to fetch nutrients for ${ingredient_name}: ${error.message}`,
  //           );
  //         }

  //         let ingredient = await this.databaseService.ingredients.findUnique({
  //           where: { name: ingredient_name },
  //         });

  //         if (!ingredient) {
  //           ingredient = await this.databaseService.ingredients.create({
  //             data: { name: ingredient_name, ...nutrients },
  //           });
  //         } else {
  //           await this.databaseService.ingredients.update({
  //             where: { name: ingredient_name },
  //             data: nutrients,
  //           });
  //         }

  //         ingredient_groups.push({
  //           category_id: ingredient_category.id,
  //           ingredient_id: ingredient.id,
  //         });

  //         // await new Promise((resolve) => setTimeout(resolve, 3000));
  //       }

  //       const { count } =
  //         await this.databaseService.ingredientGroups.createMany({
  //           data: ingredient_groups,
  //           skipDuplicates: true,
  //         });

  //       this.logger.log(
  //         `Crawled ${count} ingredients for category ${group.group_name}`,
  //       );
  //     }

  //     this.logger.log("Crawled ingredients successfully");
  //   } catch (error) {
  //     this.logger.error(`Crawling process failed: ${error}`);
  //   } finally {
  //     this.is_crawling_ingredients = false;
  //   }
  // }
}
