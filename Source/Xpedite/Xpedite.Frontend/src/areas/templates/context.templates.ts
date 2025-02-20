import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { GenerateApiModel, GeneratedFiles, PostApiV1XpediteGenerateTemplateData, PostApiV1XpediteSaveTemplateData, V1Service } from "../../api";
import CodeGeneratorContext from "../../contexts/CodeGeneratorContext";
import { UmbDataSourceResponse } from "@umbraco-cms/backoffice/repository";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";

export class XpediteTemplatesContext extends CodeGeneratorContext<GenerateApiModel> {
  constructor(host: UmbControllerHost) {
    super(host);

    this.provideContext(TEMPLATES_CONTEXT_TOKEN, this);
  }

  sendGenerateRequest(): Promise<UmbDataSourceResponse<GeneratedFiles>> {
    const data = {
      requestBody: this.apiModel,
    } as PostApiV1XpediteGenerateTemplateData;

    return tryExecuteAndNotify(this, V1Service.postApiV1XpediteGenerateTemplate(data));
  }

  sendApplyToCodebaseRequest(): Promise<UmbDataSourceResponse<string>> {
    const data = {
        requestBody: this.apiModel,
      } as PostApiV1XpediteSaveTemplateData;
  
      return tryExecuteAndNotify(this, V1Service.postApiV1XpediteSaveTemplate(data));
  }

  sendForceApplyToCodebaseRequest(): Promise<UmbDataSourceResponse> {
    const data = {
        requestBody: this.apiModel,
        force: true
      } as PostApiV1XpediteSaveTemplateData;
  
      return tryExecuteAndNotify(this, V1Service.postApiV1XpediteSaveTemplate(data));
  }
}

export default XpediteTemplatesContext;

export const TEMPLATES_CONTEXT_TOKEN = new UmbContextToken<XpediteTemplatesContext>("xpedite.TemplatesContext");