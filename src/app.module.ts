import { Module } from "@nestjs/common";
import * as dotenv from "dotenv";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { InfisicalModule } from "nestjs-infisical-sdk";

dotenv.config({});

@Module({
  imports: [
    InfisicalModule.register({
      clientId: process.env.INFISICAL_CLIENT_ID,
      clientSecret: process.env.INFISICAL_CLIENT_SECRET,
      environment: "dev",
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
