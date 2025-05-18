import { IngredientModule } from "@app/api/core/ingredient/ingredient.module";
import { UserModule } from "@app/api/core/user/user.module";
import { Module } from "@nestjs/common";
import { RecipeModule } from "./recipe/recipe.module";

@Module({
  imports: [IngredientModule, UserModule, RecipeModule],
})
export class CoreModule {}
