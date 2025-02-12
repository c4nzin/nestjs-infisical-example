import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import * as dotenvx from "@dotenvx/dotenvx";
import { AppService } from "./app.service";
import { InfisicalModule } from "nestjs-infisical-sdk";
import { ConfigModule, ConfigService } from "@nestjs/config";

dotenvx.config({});

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // InfisicalModule.register({ If you want to use not with async just uncomment it.
    //   clientId: process.env.INFISICAL_CLIENT_ID,
    //   clientSecret: process.env.INFISICAL_CLIENT_SECRET,
    //   projectId: process.env.INFISICAL_PROJECT_ID,
    //   environment: "dev",
    //   watchEnvFile: true,
    //   injectIntoProcessEnv: true,
    // )},
    InfisicalModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        clientId: configService.get<string>("INFISICAL_CLIENT_ID"),
        clientSecret: configService.get<string>("INFISICAL_CLIENT_SECRET"),
        injectIntoProcessEnv: true,
        projectId: configService.get<string>("INFISICAL_PROJECT_ID"),
        environment: "dev",
        watchEnvFile: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
