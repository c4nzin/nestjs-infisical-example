import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
} from "@nestjs/common";
import { AppService } from "./app.service";
import {
  ApiV3SecretsRawGet200Response,
  ApiV3SecretsRawSecretNameGet200Response,
  ApiV3SecretsRawSecretNamePost200Response,
} from "nestjs-infisical-sdk";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("secret/:secretName")
  public async getSecret(
    @Param("secretName") secretName: string
  ): Promise<ApiV3SecretsRawSecretNameGet200Response> {
    return this.appService.getSecret(secretName);
  }

  @Post("secret")
  public async createSecret(
    @Body() createSecretDto: { secretName: string; secretValue: string }
  ): Promise<ApiV3SecretsRawSecretNamePost200Response> {
    return this.appService.createSecret(
      createSecretDto.secretName,
      createSecretDto.secretValue
    );
  }

  @Put("secret/:secretName")
  public async updateSecret(
    @Param("secretName") secretName: string,
    @Body() updateSecretDto: { secretValue: string }
  ): Promise<ApiV3SecretsRawSecretNamePost200Response> {
    return this.appService.updateSecret(
      secretName,
      updateSecretDto.secretValue
    );
  }

  @Delete("secret/:secretName")
  public async deleteSecret(
    @Param("secretName") secretName: string
  ): Promise<ApiV3SecretsRawSecretNamePost200Response> {
    return this.appService.deleteSecret(secretName);
  }

  @Get("secrets")
  public async listSecrets(): Promise<ApiV3SecretsRawGet200Response> {
    return this.appService.listSecrets();
  }
}
