import { RecipeCron } from "@app/crawler/recipe/recipe.cron";
import { RecipeScript } from "@app/crawler/recipe/recipe.script";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  providers: [RecipeCron, RecipeScript],
})
export class RecipeModule {}
