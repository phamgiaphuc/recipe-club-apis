import { BaseModule } from "@app/api/base/base.module";
import generalEnvConfig from "@app/common/config/env.config";
import envConfig from "@app/api/common/config/env.config";
import { LoggerMiddleware } from "@app/api/common/middleware/logger.middleware";
import { CoreModule } from "@app/api/core/core.module";
import { CacheModule } from "@app/common/cache/cache.module";
import { DatabaseModule } from "@app/common/database/database.module";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.development", ".env.production"],
      load: [generalEnvConfig, envConfig],
    }),
    DatabaseModule,
    CacheModule,
    BaseModule,
    CoreModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
