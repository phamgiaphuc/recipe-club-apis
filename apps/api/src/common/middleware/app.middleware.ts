import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as cookieParser from "cookie-parser";
import * as compression from "compression";
import { HttpExceptionFilter } from "@app/api/common/config/http-exception.config";

export const enableAppMiddleware = (app: NestExpressApplication) => {
  const configService = app.get(ConfigService);
  const globalPrefix = configService.get<string>("API_SERVICE_GLOBAL_PREFIX");

  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://146.196.67.244:8000/",
    ],
    credentials: true,
  });
  app.setGlobalPrefix(globalPrefix);
  app.use(compression({ level: 1 }));
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  // Always set error middleware last
  app.useGlobalFilters(new HttpExceptionFilter(configService));
};
