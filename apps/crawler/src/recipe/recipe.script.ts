import { CacheService } from "@app/common/cache/cache.service";
import { RECIPE_INGR_INDEX } from "@app/crawler/recipe/recipe";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";

@Injectable()
export class RecipeScript implements OnModuleInit {
  private readonly logger = new Logger(RecipeScript.name);

  constructor(private readonly cacheService: CacheService) {}

  async onModuleInit() {
    try {
      await this.createDefaultRecipeIngredientIndexKey();
    } catch (error) {
      throw error;
    }
  }

  private async createDefaultRecipeIngredientIndexKey() {
    try {
      const key = await this.cacheService.getData({
        key: RECIPE_INGR_INDEX,
      });
      if (!key) {
        await this.cacheService.setData({
          key: RECIPE_INGR_INDEX,
          value: 0,
        });
      }
      this.logger.log("Created default recipe ingredient index key");
    } catch (error) {
      throw error;
    }
  }
}
