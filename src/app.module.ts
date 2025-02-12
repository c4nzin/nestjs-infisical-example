import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import * as dotenvx from "@dotenvx/dotenvx";
import { AppService } from "./app.service";
import { InfisicalModule } from "nestjs-infisical-sdk";

dotenvx.config({});

@Module({
  imports: [
    InfisicalModule.register({
      clientId: process.env.INFISICAL_CLIENT_ID,
      clientSecret: process.env.INFISICAL_CLIENT_SECRET,
      projectId: process.env.INFISICAL_PROJECT_ID,
      environment: "dev",
      watchEnvFile: true,
      injectIntoProcessEnv: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
