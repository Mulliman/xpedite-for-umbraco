import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { CheckInput, PostApiV1XpediteAssistantTemplateActionData, PostApiV1XpediteAssistantTemplateChecksData, V1Service } from "../../api";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import AssistantContext from "../../contexts/AssistantContext";

export class XpediteTemplatesAssistantContext extends AssistantContext<CheckInput> {
  constructor(host: UmbControllerHost) {
    super(host);

    this.provideContext(TEMPLATES_ASSISTANT_CONTEXT_TOKEN, this);
  }

  sendGetAssistantChecksRequest() {
    const data = {
      requestBody: this.apiModel
    } as PostApiV1XpediteAssistantTemplateChecksData;

    return tryExecuteAndNotify(this, V1Service.postApiV1XpediteAssistantTemplateChecks(data));
  }

  sendRunAssistantActionRequest(actionName: string) {
    const data = {
      requestBody: {
        documentTypeId: this.apiModel?.documentTypeId,
        actionName: actionName
      }
    } as PostApiV1XpediteAssistantTemplateActionData;

    return tryExecuteAndNotify(this, V1Service.postApiV1XpediteAssistantTemplateAction(data));
  }
}

export default XpediteTemplatesAssistantContext;

export const TEMPLATES_ASSISTANT_CONTEXT_TOKEN = new UmbContextToken<XpediteTemplatesAssistantContext>("xpedite.TemplatesAssistantContext");