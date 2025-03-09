import { IngredientModule } from "@app/api/core/ingredient/ingredient.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [IngredientModule],
})
export class CoreModule {}
