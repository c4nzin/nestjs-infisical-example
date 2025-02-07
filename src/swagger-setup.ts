import { NestApplication } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: NestApplication): void {
  const swaggerOptions = new DocumentBuilder()
    .addTag("infisical-sdk-example")
    .setTitle("Infisical SDK Example")
    .setDescription("Infisical SDK Example")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);

  SwaggerModule.setup("swagger", app, document);
  SwaggerModule.setup("/", app, document);
}
