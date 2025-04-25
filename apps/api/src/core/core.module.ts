import { IngredientModule } from "@app/api/core/ingredient/ingredient.module";
import { UserModule } from "@app/api/core/user/user.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [IngredientModule, UserModule],
})
export class CoreModule {}
