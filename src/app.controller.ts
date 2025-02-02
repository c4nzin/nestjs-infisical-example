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
  CreateDynamicSecretResult,
  CreateSecretResult,
  DeleteDynamicSecretResult,
  DeleteSecretResult,
  GetSecretResult,
  ListSecretsResult,
  UpdateSecretResult,
} from "nestjs-infisical-sdk";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("secret/:secretName")
  public async getSecret(
    @Param("secretName") secretName: string
  ): Promise<GetSecretResult> {
    return this.appService.getSecret(secretName);
  }

  @Post("secret")
  public async createSecret(
    @Body() createSecretDto: { secretName: string; secretValue: string }
  ): Promise<CreateSecretResult> {
    return this.appService.createSecret(
      createSecretDto.secretName,
      createSecretDto.secretValue
    );
  }

  @Put("secret/:secretName")
  public async updateSecret(
    @Param("secretName") secretName: string,
    @Body() updateSecretDto: { secretValue: string }
  ): Promise<UpdateSecretResult> {
    return this.appService.updateSecret(
      secretName,
      updateSecretDto.secretValue
    );
  }

  @Delete("secret/:secretName")
  public async deleteSecret(
    @Param("secretName") secretName: string
  ): Promise<DeleteSecretResult> {
    return this.appService.deleteSecret(secretName);
  }

  @Get("secrets")
  public async listSecrets(): Promise<ListSecretsResult> {
    return this.appService.listSecrets();
  }

  @Post("dynamic-secret")
  public async createDynamicSecret(): Promise<CreateDynamicSecretResult> {
    return this.appService.createDynamicSecret();
  }

  @Delete("dynamic-secret/:dynamicSecretName")
  public async deleteDynamicSecret(
    @Param("dynamicSecretName") dynamicSecretName: string
  ): Promise<DeleteDynamicSecretResult> {
    return this.appService.deleteDynamicSecret(dynamicSecretName);
  }
}
