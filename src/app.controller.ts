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
import { ApiTags, ApiOperation, ApiParam, ApiBody } from "@nestjs/swagger";

@Controller()
@ApiTags("secrets")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("secret/:secretName")
  @ApiOperation({ summary: "Get a secret by name" })
  @ApiParam({ name: "secretName", description: "The name of the secret" })
  public async getSecret(
    @Param("secretName") secretName: string
  ): Promise<GetSecretResult> {
    return this.appService.getSecret(secretName);
  }

  @Post("secret")
  @ApiOperation({ summary: "Create a new secret" })
  @ApiBody({
    description: "The secret name and value",
    schema: {
      type: "object",
      properties: {
        secretName: { type: "string" },
        secretValue: { type: "string" },
      },
    },
  })
  public async createSecret(
    @Body() createSecretDto: { secretName: string; secretValue: string }
  ): Promise<CreateSecretResult> {
    return this.appService.createSecret(
      createSecretDto.secretName,
      createSecretDto.secretValue
    );
  }

  @Put("secret/:secretName")
  @ApiOperation({ summary: "Update an existing secret" })
  @ApiParam({ name: "secretName", description: "The name of the secret" })
  @ApiBody({
    description: "The new value of the secret",
    schema: {
      type: "object",
      properties: {
        secretValue: { type: "string" },
      },
    },
  })
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
  @ApiOperation({ summary: "Delete a secret by name" })
  @ApiParam({ name: "secretName", description: "The name of the secret" })
  public async deleteSecret(
    @Param("secretName") secretName: string
  ): Promise<DeleteSecretResult> {
    return this.appService.deleteSecret(secretName);
  }

  @Get("secrets")
  @ApiOperation({ summary: "List all secrets" })
  public async listSecrets(): Promise<ListSecretsResult> {
    return this.appService.listSecrets();
  }

  @Post("dynamic-secret")
  @ApiOperation({ summary: "Create a new dynamic secret" })
  public async createDynamicSecret(
    @Body()
    createDynamicSecretDto: {
      secretName: string;
      projectSlug?: string;
      environmentSlug?: string;
    }
  ): Promise<CreateDynamicSecretResult> {
    return this.appService.createDynamicSecret(
      createDynamicSecretDto.secretName,
      createDynamicSecretDto.projectSlug,
      createDynamicSecretDto.environmentSlug
    );
  }

  @Delete("dynamic-secret/:dynamicSecretName")
  @ApiOperation({ summary: "Delete a dynamic secret by name" })
  @ApiParam({
    name: "dynamicSecretName",
    description: "The name of the dynamic secret",
  })
  public async deleteDynamicSecret(
    @Param("dynamicSecretName") dynamicSecretName: string
  ): Promise<DeleteDynamicSecretResult> {
    return this.appService.deleteDynamicSecret(dynamicSecretName);
  }
}
