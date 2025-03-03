import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { CheckResult, GeneratedFiles } from "../api";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbDataSourceResponse } from "@umbraco-cms/backoffice/repository";
import { Observable, UmbObjectState } from "@umbraco-cms/backoffice/observable-api";
import { umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { debounce } from "@umbraco-cms/backoffice/utils";

export default abstract class AssistantContext<T> extends UmbControllerBase {
  #apiModel?: T;

  public get apiModel(): T | undefined { return this.#apiModel; }

  #checks = new UmbObjectState<CheckResult[] | undefined>(undefined);
  public get checks(): Observable<CheckResult[] | undefined> {
    return this.#checks.asObservable();
  }

  constructor(host: UmbControllerHost) {
    super(host);
  }

  clearApiModel() {
    this.#apiModel = undefined;
    this.#checks.setValue(undefined);
  }

  updateApiModel(apiModel: T) {
    this.#apiModel = apiModel;
    this.performChecks();
  }
  
  async performChecks() {
    if (!this.isValidApiModel()) {
      return;
    }

    try {
      const response = await this.sendGetAssistantChecksRequest();
      this.#checks.setValue(response.data);
    } catch (error) {
      console.error("Error performing assistant checks:", error);
      return;
    }
  }

  async runAction(actionName: string) {
    if (!this.isValidApiModel()) {
      return;
    }

    try {
      const response = await this.sendRunAssistantActionRequest(actionName);

      if(response.error){
        console.error("Error running action:", response.error);
        return;
      }

      this.#checks.setValue(response.data);
    } catch (error) {
      console.error("Error running action:", error);
      return;
    }
  }

  abstract sendGetAssistantChecksRequest(): Promise<UmbDataSourceResponse<CheckResult[]>>;

  abstract sendRunAssistantActionRequest(actionName: string): Promise<UmbDataSourceResponse<CheckResult[]>>;

  isValidApiModel(): boolean {
    return true;
  }
}
