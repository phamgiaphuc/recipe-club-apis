import { NestFactory } from "@nestjs/core";
import { ApiModule } from "./api.module";
import { Logger } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { enableSwaggerDoc } from "@app/api/common/config/swagger.config";
import { getAppConfigs } from "@app/api/common/config/app.config";
import { enableAppMiddleware } from "@app/api/common/middleware/app.middleware";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ApiModule);
  const logger = new Logger(bootstrap.name);
  const { port, global_prefix, name } = getAppConfigs(app);

  enableSwaggerDoc(app);
  enableAppMiddleware(app);

  await app.listen(port, async () => {
    const server_url = (await app.getUrl()).replace("[::1]", "localhost");
    logger.log(`------- ${name} --------`);
    logger.log(`Server is running on ${server_url}`);
    logger.log(`APIs is running on ${server_url + global_prefix}`);
    logger.log(`Swagger docs is running on ${server_url}/docs`);
  });
}
bootstrap();
