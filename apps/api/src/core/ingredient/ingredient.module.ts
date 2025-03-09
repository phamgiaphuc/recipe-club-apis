import { IngredientController } from "@app/api/core/ingredient/ingredient.controller";
import { IngredientService } from "@app/api/core/ingredient/ingredient.service";
import { Module } from "@nestjs/common";

@Module({
  controllers: [IngredientController],
  providers: [IngredientService],
})
export class IngredientModule {}
