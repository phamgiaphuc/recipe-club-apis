import { getAppConfigs } from "@app/api/common/config/app.config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const tags = ["Auth", "Ingredients"];
const developmentUrls = ["localhost"];
const productionUrls = ["146.196.67.244"];

const generateTags = (tags: string[]) => {
  return tags.map((tag) => {
    return {
      name: tag,
      description: `All APIs to interact with ${tag.toLowerCase()}`,
    };
  });
};

export const generateDocumentBuilder = (
  port: number,
  global_prefix: string,
  node_env: string,
) => {
  const document = new DocumentBuilder()
    .setTitle("Recipe Club APIs Documentation (API Service)")
    .setDescription("This is the API Docs for using internally.")
    .setVersion("1.0")
    .setTermsOfService("http://swagger.io/terms/")
    .setLicense("MIT License", "https://opensource.org/license/mit")
    .setExternalDoc("Find out more about Swagger", "http://swagger.io")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" });
  generateTags(tags).forEach((tag) =>
    document.addTag(tag.name, tag.description),
  );
  if (node_env === "development") {
    developmentUrls.forEach((url, index) => {
      document.addServer(
        `http://${url}:${port}${global_prefix}`,
        `Development server ${index + 1}`,
      );
    });
  } else {
    productionUrls.forEach((url, index) => {
      document.addServer(
        `http://${url}:${port}${global_prefix}`,
        `Production server ${index + 1}`,
      );
    });
  }
  return document.build();
};

export const enableSwaggerDoc = (app: NestExpressApplication) => {
  const { port, global_prefix, node_env } = getAppConfigs(app);
  const swaggerConfig = generateDocumentBuilder(port, global_prefix, node_env);
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup("docs", app, document, {
    jsonDocumentUrl: "docs/json",
    swaggerOptions: { persistAuthorization: true },
  });
};
