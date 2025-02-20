import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { GenerateBlockApiModel, GeneratedFiles, PostApiV1XpediteGenerateBlockData, PostApiV1XpediteSaveBlockData, V1Service } from "../../api";
import CodeGeneratorContext from "../../contexts/CodeGeneratorContext";
import { UmbDataSourceResponse } from "@umbraco-cms/backoffice/repository";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";

export class XpediteBlocksContext extends CodeGeneratorContext<GenerateBlockApiModel> {
  constructor(host: UmbControllerHost) {
    super(host);

    this.provideContext(BLOCKS_CONTEXT_TOKEN, this);
  }

  sendGenerateRequest(): Promise<UmbDataSourceResponse<GeneratedFiles>> {
    const data = {
      requestBody: this.apiModel,
    } as PostApiV1XpediteGenerateBlockData;

    return tryExecuteAndNotify(this, V1Service.postApiV1XpediteGenerateBlock(data));
  }

  sendApplyToCodebaseRequest(): Promise<UmbDataSourceResponse<string>> {
    const data = {
        requestBody: this.apiModel,
      } as PostApiV1XpediteSaveBlockData;
  
      return tryExecuteAndNotify(this, V1Service.postApiV1XpediteSaveBlock(data));
  }

  sendForceApplyToCodebaseRequest(): Promise<UmbDataSourceResponse> {
    const data = {
        requestBody: this.apiModel,
        force: true
      } as PostApiV1XpediteSaveBlockData;
  
      return tryExecuteAndNotify(this, V1Service.postApiV1XpediteSaveBlock(data));
  }
}

export default XpediteBlocksContext;

export const BLOCKS_CONTEXT_TOKEN = new UmbContextToken<XpediteBlocksContext>("xpedite.BlocksContext");