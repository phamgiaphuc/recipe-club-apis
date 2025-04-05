import { Module } from "@nestjs/common";
import { IngredientCron } from "apps/crawler/src/ingredient/ingredient.cron";

@Module({
  imports: [],
  providers: [IngredientCron],
})
export class IngredientModule {}
