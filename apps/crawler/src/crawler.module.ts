import { CacheModule } from "@app/common/cache/cache.module";
import { DatabaseModule } from "@app/common/database/database.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { RecipeModule } from "apps/crawler/src/recipe/recipe.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.development", ".env.production"],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    CacheModule,
    RecipeModule,
  ],
  controllers: [],
  providers: [],
})
export class CrawlerModule {}
