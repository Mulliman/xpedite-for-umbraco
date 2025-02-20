import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { GenerateApiModel, GeneratedFiles, PostApiV1XpediteGeneratePartialData, PostApiV1XpediteSavePartialData, V1Service } from "../../api";
import CodeGeneratorContext from "../../contexts/CodeGeneratorContext";
import { UmbDataSourceResponse } from "@umbraco-cms/backoffice/repository";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";

export class XpeditePartialsContext extends CodeGeneratorContext<GenerateApiModel> {
  constructor(host: UmbControllerHost) {
    super(host);

    this.provideContext(PARTIALS_CONTEXT_TOKEN, this);
  }

  sendGenerateRequest(): Promise<UmbDataSourceResponse<GeneratedFiles>> {
    const data = {
      requestBody: this.apiModel,
    } as PostApiV1XpediteGeneratePartialData;

    return tryExecuteAndNotify(this, V1Service.postApiV1XpediteGeneratePartial(data));
  }

  sendApplyToCodebaseRequest(): Promise<UmbDataSourceResponse<string>> {
    const data = {
        requestBody: this.apiModel,
      } as PostApiV1XpediteSavePartialData;
  
      return tryExecuteAndNotify(this, V1Service.postApiV1XpediteSavePartial(data));
  }

  sendForceApplyToCodebaseRequest(): Promise<UmbDataSourceResponse> {
    const data = {
        requestBody: this.apiModel,
        force: true
      } as PostApiV1XpediteSavePartialData;
  
      return tryExecuteAndNotify(this, V1Service.postApiV1XpediteSavePartial(data));
  }
}

export default XpeditePartialsContext;

export const PARTIALS_CONTEXT_TOKEN = new UmbContextToken<XpeditePartialsContext>("xpedite.PartialsContext");