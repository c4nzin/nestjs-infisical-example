import { Injectable, Logger } from "@nestjs/common";
import {
  InfisicalService,
  InjectInfisical,
  GetSecretResponse,
  CreateSecretResponse,
  UpdateSecretResponse,
  DeleteSecretResponse,
  ListSecretsResponse,
  CreateDynamicSecretResponse,
  DeleteDynamicSecretResponse,
  DynamicSecretProviders,
  CreateProjectResponse,
  Membership,
  CreateEnvironmentResponse,
  CreateFolderResponse,
  ListFoldersResponse,
  CreateKmsKeyResponse,
  KeyUsage,
  EncryptionAlgorithm,
  GetKmsKeyByNameResponse,
  DeleteKmsKeyResponse,
  KmsEncryptDataResponse,
  KmsDecryptDataResponse,
  KmsSignDataResponse,
  SigningAlgorithm,
  KmsVerifyDataResponse,
  KmsGetPublicKeyResponse,
  KmsListSigningAlgorithmsResponse,
} from "nestjs-infisical-sdk";

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectInfisical() private readonly infisicalService: InfisicalService
  ) {}

  // ================== SECRETS MANAGEMENT ==================
  public async getSecret(secretName: string): Promise<GetSecretResponse> {
    this.logger.log(`Getting secret: ${secretName}`);
    const result = await this.infisicalService.secrets().getSecret({
      environment: "dev",
      secretName,
      projectId: process.env.INFISICAL_PROJECT_ID,
    });
    this.logger.log(`Secret retrieved: ${JSON.stringify(result)}`);
    return { secret: result };
  }
  public async createSecret(
    secretName: string,
    secretValue: string
  ): Promise<CreateSecretResponse> {
    this.logger.log(`Creating secret: ${secretName}`);
    const result = await this.infisicalService
      .secrets()
      .createSecret(secretName, {
        environment: "dev",
        secretValue,
        projectId: process.env.INFISICAL_PROJECT_ID,
      });
    this.logger.log(`Secret created: ${JSON.stringify(result)}`);
    return { secret: result, ...result };
  }
  public async updateSecret(
    secretName: string,
    secretValue: string
  ): Promise<UpdateSecretResponse> {
    this.logger.log(`Updating secret: ${secretName}`);
    const result = await this.infisicalService
      .secrets()
      .updateSecret(secretName, {
        environment: "dev",
        secretValue,
        projectId: process.env.INFISICAL_PROJECT_ID,
      });
    this.logger.log(`Secret updated: ${JSON.stringify(result)}`);
    return { secret: result, ...result };
  }
  public async deleteSecret(secretName: string): Promise<DeleteSecretResponse> {
    this.logger.log(`Deleting secret: ${secretName}`);
    const result = await this.infisicalService
      .secrets()
      .deleteSecret(secretName, {
        environment: "dev",
        projectId: process.env.INFISICAL_PROJECT_ID,
      });
    this.logger.log(`Secret deleted: ${JSON.stringify(result)}`);
    return { secret: result, ...result };
  }

  public async listSecrets(): Promise<ListSecretsResponse> {
    this.logger.log("Listing secrets");
    const result = await this.infisicalService.secrets().listSecrets({
      environment: "dev",
      projectId: process.env.INFISICAL_PROJECT_ID,
      expandSecretReferences: true,
      viewSecretValue: true,
      recursive: false,
      includeImports: false,
    });
    this.logger.log(`Secrets listed: ${JSON.stringify(result)}`);
    return result;
  }

  // ================== DYNAMIC SECRETS ==================
  public async createDynamicSecret(
    secretName: string,
    projectSlug?: string,
    environmentSlug?: string
  ): Promise<CreateDynamicSecretResponse> {
    const result = await this.infisicalService.dynamicSecrets().create({
      provider: {
        type: DynamicSecretProviders.Redis,
        inputs: {
          host: "localhost",
          port: 6379,
          username: "user1",
          password: "12345612356",
          creationStatement: `ACL SETUSER {{username}} on >{{password}} ~* &* +@all`,
          revocationStatement: `ACL DELUSER {{username}}`,
        },
      },
      defaultTTL: "1h",
      maxTTL: "24h", // ✅ Zorunlu alan eklendi
      environmentSlug: environmentSlug || "dev",
      name: secretName,
      projectSlug: projectSlug || "project-slug",
    });

    this.logger.log(`Dynamic secret created: ${JSON.stringify(result)}`);
    return { dynamicSecret: result };
  }
  public async deleteDynamicSecret(
    dynamicSecretName: string,
    projectSlug?: string,
    environmentSlug?: string
  ): Promise<DeleteDynamicSecretResponse> {
    const result = await this.infisicalService
      .dynamicSecrets()
      .delete(dynamicSecretName, {
        environmentSlug: environmentSlug || "dev",
        projectSlug: projectSlug || "project-slug",
      });

    this.logger.log(`Dynamic secret deleted: ${dynamicSecretName}`);
    return { dynamicSecret: result };
  }

  // ================== PROJECTS MANAGEMENT ==================
  public async createProject(
    projectName: string,
    description?: string
  ): Promise<CreateProjectResponse> {
    const result = await this.infisicalService.projects().create({
      projectName,
      type: "secret-manager",
      projectDescription: description,
      slug: projectName.toLowerCase().replace(/\s+/g, "-"),
    });

    this.logger.log(`Project created: ${JSON.stringify(result)}`);
    return { project: result };
  }

  public async inviteMembers(
    projectId: string,
    emails: string[]
  ): Promise<Membership[]> {
    const result = await this.infisicalService.projects().inviteMembers({
      projectId,
      emails,
      roleSlugs: ["member"],
    });

    this.logger.log(`Members invited: ${JSON.stringify(result)}`);
    return result;
  }

  // ================== ENVIRONMENTS MANAGEMENT ==================
  public async createEnvironment(
    projectId: string,
    name: string,
    slug: string
  ): Promise<CreateEnvironmentResponse> {
    const result = await this.infisicalService.environments().create({
      name,
      projectId,
      slug,
      position: 1,
    });

    this.logger.log(`Environment created: ${JSON.stringify(result)}`);
    return {
      environment: result,
      workspace: projectId,
      message: "Environment created successfully",
    };
  }

  // ================== FOLDERS MANAGEMENT ==================
  public async createFolder(
    projectId: string,
    folderName: string,
    environment: string,
    path?: string
  ): Promise<CreateFolderResponse> {
    const result = await this.infisicalService.folders().create({
      name: folderName,
      path: path || "/",
      projectId,
      environment,
      description: `Folder for ${folderName}`,
    });

    this.logger.log(`Folder created: ${JSON.stringify(result)}`);
    return { folder: result };
  }
  public async listFolders(
    projectId: string,
    environment: string,
    path?: string
  ): Promise<ListFoldersResponse> {
    const result = await this.infisicalService.folders().listFolders({
      environment,
      projectId,
      path: path || "/",
      recursive: false,
    });

    this.logger.log(`Folders listed: ${JSON.stringify(result)}`);
    return { folders: result };
  }

  // ================== KMS - KEY MANAGEMENT ==================
  public async createEncryptionKey(
    projectId: string,
    keyName: string
  ): Promise<CreateKmsKeyResponse> {
    const result = await this.infisicalService.kms().keys().create({
      projectId,
      name: keyName,
      description: "Key for encrypting sensitive data",
      keyUsage: KeyUsage.ENCRYPTION,
      encryptionAlgorithm: EncryptionAlgorithm.AES_256_GCM,
    });

    this.logger.log(`Encryption key created: ${JSON.stringify(result)}`);
    return { key: result };
  }
  public async createSigningKey(
    projectId: string,
    keyName: string
  ): Promise<CreateKmsKeyResponse> {
    const result = await this.infisicalService.kms().keys().create({
      projectId,
      name: keyName,
      description: "Key for signing documents",
      keyUsage: KeyUsage.SIGNING,
      encryptionAlgorithm: EncryptionAlgorithm.RSA_4096,
    });

    this.logger.log(`Signing key created: ${JSON.stringify(result)}`);
    return { key: result };
  }

  public async getKeyByName(
    projectId: string,
    keyName: string
  ): Promise<GetKmsKeyByNameResponse> {
    const result = await this.infisicalService.kms().keys().getByName({
      projectId,
      name: keyName,
    });

    this.logger.log(`Key retrieved: ${JSON.stringify(result)}`);
    return { key: result };
  }

  public async deleteKey(keyId: string): Promise<DeleteKmsKeyResponse> {
    const result = await this.infisicalService.kms().keys().delete({
      keyId,
    });

    this.logger.log(`Key deleted: ${JSON.stringify(result)}`);
    return { key: result };
  }

  // ================== KMS - ENCRYPTION ==================

  public async encryptData(
    keyId: string,
    plaintext: string
  ): Promise<KmsEncryptDataResponse> {
    const base64Data = Buffer.from(plaintext).toString("base64");
    const result = await this.infisicalService.kms().encryption().encrypt({
      keyId,
      plaintext: base64Data,
    });

    this.logger.log(`Data encrypted`);
    return { ciphertext: result };
  }

  public async decryptData(
    keyId: string,
    ciphertext: string
  ): Promise<KmsDecryptDataResponse> {
    const result = await this.infisicalService.kms().encryption().decrypt({
      keyId,
      ciphertext,
    });

    this.logger.log(`Data decrypted`);
    return { plaintext: result };
  }

  // ================== KMS - SIGNING ==================

  public async signData(
    keyId: string,
    data: string
  ): Promise<KmsSignDataResponse> {
    const result = await this.infisicalService
      .kms()
      .signing()
      .sign({
        keyId,
        data: Buffer.from(data).toString("base64"),
        signingAlgorithm: SigningAlgorithm.RSASSA_PSS_SHA_256,
        isDigest: false,
      });

    this.logger.log(`Data signed: ${JSON.stringify(result)}`);
    return result;
  }

  public async verifySignature(
    keyId: string,
    data: string,
    signature: string
  ): Promise<KmsVerifyDataResponse> {
    const result = await this.infisicalService
      .kms()
      .signing()
      .verify({
        keyId,
        data: Buffer.from(data).toString("base64"),
        signature,
        signingAlgorithm: SigningAlgorithm.RSASSA_PSS_SHA_256,
        isDigest: false,
      });

    this.logger.log(`Signature valid: ${result.signatureValid}`);
    return result;
  }

  public async getPublicKey(keyId: string): Promise<KmsGetPublicKeyResponse> {
    const result = await this.infisicalService.kms().signing().getPublicKey({
      keyId,
    });

    this.logger.log(`Public key retrieved`);
    return { publicKey: result };
  }

  public async listSigningAlgorithms(
    keyId: string
  ): Promise<KmsListSigningAlgorithmsResponse> {
    const result = await this.infisicalService
      .kms()
      .signing()
      .listSigningAlgorithms({
        keyId,
      });

    this.logger.log(`Supported algorithms: ${JSON.stringify(result)}`);
    return { signingAlgorithms: result };
  }
}
