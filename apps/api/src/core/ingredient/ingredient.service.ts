import { GetCategoriesResponse } from "@app/api/common/types/ingredient";
import { CATEGORY_LIST_KEY } from "@app/api/core/ingredient/ingredient.constant";
import { CacheService } from "@app/common/cache/cache.service";
import { DatabaseService } from "@app/common/database/database.service";
import { convertToMilliseconds } from "@app/common/utils/date-format";
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { omit } from "lodash";

@Injectable()
export class IngredientService {
  private readonly logger = new Logger(IngredientService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cacheService: CacheService,
  ) {}

  public async getCategories() {
    try {
      let categories: GetCategoriesResponse[];
      categories = await this.cacheService.getData({ key: CATEGORY_LIST_KEY });
      if (!categories) {
        const data = await this.databaseService.ingredientCategories.findMany({
          include: {
            group: {
              include: {
                ingredient: {
                  select: {
                    id: true,
                    name: true,
                    image_url: true,
                  },
                },
              },
            },
          },
          orderBy: {
            id: "asc",
          },
        });
        categories = data.map((category) => {
          return {
            ...omit(category, ["group"]),
            ingredients: category.group.map((g) => g.ingredient),
          };
        });
        await this.cacheService.setData({
          key: CATEGORY_LIST_KEY,
          value: categories,
          expires_in: convertToMilliseconds("6h"),
        });
      }
      this.logger.log("Get categories successfully");
      return {
        code: 0,
        message: "Get categories successfully",
        data: categories,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
