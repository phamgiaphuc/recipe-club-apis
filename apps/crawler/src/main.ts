import { NestFactory } from "@nestjs/core";
import { CrawlerModule } from "./crawler.module";

async function bootstrap() {
  const app = await NestFactory.create(CrawlerModule);
  await app.listen(process.env.CRAWLER_SERVICE_PORT ?? 3000);
}
bootstrap();
