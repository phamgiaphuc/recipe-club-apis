import { IngredientModule } from "@app/api/core/ingredient/ingredient.module";
import { Module } from "@nestjs/common";
import { UserPantriesModule } from "@app/api/core/user-pantries/user-pantries.module";

@Module({
  imports: [IngredientModule, UserPantriesModule],
})
export class CoreModule {}
