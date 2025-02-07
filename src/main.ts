import { NestApplication, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { setupSwagger } from "./swagger-setup";

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  setupSwagger(app);
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
