import { IngredientService } from "@app/api/core/ingredient/ingredient.service";
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Ingredients")
@Controller("ingredients")
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get("categories")
  async getIngredientCategories() {
    return this.ingredientService.getCategories();
  }
}
