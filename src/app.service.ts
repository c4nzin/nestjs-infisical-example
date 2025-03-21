import { Injectable, Logger } from "@nestjs/common";
import {
  CreateDynamicSecretResult,
  CreateSecretResult,
  DeleteDynamicSecretResult,
  DeleteSecretResult,
  DynamicSecretProviders,
  GetSecretResult,
  InfisicalService,
  InjectInfisical,
  ListSecretsResult,
  UpdateSecretResult,
} from "nestjs-infisical-sdk";

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(@InjectInfisical() private readonly infisicalService: InfisicalService) {}

  public async getSecret(secretName: string): Promise<GetSecretResult> {
    this.logger.log(`Getting secret: ${secretName}`);
    const secretResponse = await this.infisicalService.secrets().getSecret({
      environment: "dev",
      secretName,
      projectId: process.env.INFISICAL_PROJECT_ID,
    });
    this.logger.log(`Secret retrieved: ${JSON.stringify(secretResponse)}`);
    return secretResponse;
  }

  public async createSecret(
    secretName: string,
    secretValue: string
  ): Promise<CreateSecretResult> {
    this.logger.log(`Creating secret: ${secretName}`);
    const secret = await this.infisicalService.secrets().createSecret(secretName, {
      environment: "dev",
      secretValue,
      projectId: process.env.INFISICAL_PROJECT_ID,
    });
    this.logger.log(`Secret created: ${JSON.stringify(secret)}`);
    return secret;
  }

  public async updateSecret(
    secretName: string,
    secretValue: string
  ): Promise<UpdateSecretResult> {
    this.logger.log(`Updating secret: ${secretName}`);
    const secret = await this.infisicalService.secrets().updateSecret(secretName, {
      environment: "dev",
      secretValue,
      projectId: process.env.INFISICAL_PROJECT_ID,
    });
    this.logger.log(`Secret updated: ${JSON.stringify(secret)}`);
    return secret;
  }

  public async deleteSecret(secretName: string): Promise<DeleteSecretResult> {
    this.logger.log(`Deleting secret: ${secretName}`);
    const secret = await this.infisicalService.secrets().deleteSecret(secretName, {
      environment: "dev",
      projectId: process.env.INFISICAL_PROJECT_ID,
    });
    this.logger.log(`Secret deleted: ${JSON.stringify(secret)}`);
    return secret;
  }

  public async listSecrets(): Promise<ListSecretsResult> {
    this.logger.log("Listing secrets");
    const secrets = await this.infisicalService.secrets().listSecrets({
      environment: "dev",
      projectId: process.env.INFISICAL_PROJECT_ID,
    });
    this.logger.log(`Secrets listed: ${JSON.stringify(secrets)}`);
    return secrets;
  }

  //fix
  public async createDynamicSecret(
    secretName: string,
    projectSlug?: string,
    environmentSlug?: string
  ): Promise<CreateDynamicSecretResult> {
    const createDynamicSecret = await this.infisicalService
      .dynamicSecrets()
      .create({
        provider: {
          type: DynamicSecretProviders.Redis,
          inputs: {
            host: "localhost",
            port: 6379,
            username: "user1",
            password: "12345612356",
            creationStatement: `ACL SETUSER {{user1}} on >{{123456123456}} ~* &* +@all`,
            revocationStatement: `ACL DELUSER {{user1}}`,
          },
        },
        defaultTTL: "1h",
        environmentSlug: environmentSlug || "dev",
        name: secretName,
        projectSlug: projectSlug || "project-slug",
      });

    this.logger.log(
      `Dynamic secret created: ${JSON.stringify(createDynamicSecret)}`
    );
    return createDynamicSecret;
  }

  public async deleteDynamicSecret(
    dynamicSecretName: string
  ): Promise<DeleteDynamicSecretResult> {
    const deleteDynamicSecret = await this.infisicalService
      .dynamicSecrets()
      .delete(dynamicSecretName, {
        environmentSlug: "dev",
        projectSlug: "project-slug",
      });

    return deleteDynamicSecret;
  }
}
