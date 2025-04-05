import { CacheModule } from "@app/common/cache/cache.module";
import { DatabaseModule } from "@app/common/database/database.module";
import { IngredientModule } from "@app/crawler/ingredient/ingredient.module";
import { RecipeModule } from "@app/crawler/recipe/recipe.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.development", ".env.production"],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    CacheModule,
    IngredientModule,
    RecipeModule,
  ],
  controllers: [],
  providers: [],
})
export class CrawlerModule {}
