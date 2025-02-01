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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("secret/:secretName")
  public async getSecret(
    @Param("secretName") secretName: string
  ): Promise<any> {
    return this.appService.getSecret(secretName);
  }

  @Post("secret")
  public async createSecret(
    @Body() createSecretDto: { secretName: string; secretValue: string }
  ): Promise<any> {
    return this.appService.createSecret(
      createSecretDto.secretName,
      createSecretDto.secretValue
    );
  }

  @Put("secret/:secretName")
  public async updateSecret(
    @Param("secretName") secretName: string,
    @Body() updateSecretDto: { secretValue: string }
  ): Promise<any> {
    return this.appService.updateSecret(
      secretName,
      updateSecretDto.secretValue
    );
  }

  @Delete("secret/:secretName")
  public async deleteSecret(
    @Param("secretName") secretName: string
  ): Promise<any> {
    return this.appService.deleteSecret(secretName);
  }

  @Get("secrets")
  public async listSecrets(): Promise<any> {
    return this.appService.listSecrets();
  }
}
