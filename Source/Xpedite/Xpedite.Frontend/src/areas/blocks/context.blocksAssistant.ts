import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { BlockCheckInput, PostApiV1XpediteAssistantBlockActionData, PostApiV1XpediteAssistantBlockChecksData, V1Service } from "../../api";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import AssistantContext from "../../contexts/AssistantContext";

export class XpediteBlocksAssistantContext extends AssistantContext<BlockCheckInput> {
  constructor(host: UmbControllerHost) {
    super(host);

    this.provideContext(BLOCKS_ASSISTANT_CONTEXT_TOKEN, this);
  }

  sendGetAssistantChecksRequest() {
    const data = {
      requestBody: this.apiModel
    } as PostApiV1XpediteAssistantBlockChecksData;

    return tryExecuteAndNotify(this, V1Service.postApiV1XpediteAssistantBlockChecks(data));
  }

  sendRunAssistantActionRequest(actionName: string) {
    const data = {
      requestBody: {
        documentTypeId: this.apiModel?.documentTypeId,
        settingsTypeId: this.apiModel?.settingsTypeId,
        actionName: actionName
      }
    } as PostApiV1XpediteAssistantBlockActionData;

    return tryExecuteAndNotify(this, V1Service.postApiV1XpediteAssistantBlockAction(data));
  }
}

export default XpediteBlocksAssistantContext;

export const BLOCKS_ASSISTANT_CONTEXT_TOKEN = new UmbContextToken<XpediteBlocksAssistantContext>("xpedite.BlocksAssistantContext");