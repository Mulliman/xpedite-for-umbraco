import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { GeneratedFiles } from "../api";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbDataSourceResponse } from "@umbraco-cms/backoffice/repository";
import { Observable, UmbObjectState } from "@umbraco-cms/backoffice/observable-api";
import { umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { debounce } from "@umbraco-cms/backoffice/utils";
import { UmbDocumentItemRepository } from "@umbraco-cms/backoffice/document";
import {
	UmbDocumentBlueprintItemRepository,
	type UmbDocumentBlueprintItemBaseModel,
} from '@umbraco-cms/backoffice/document-blueprint';

export default abstract class CodeGeneratorContext<T> extends UmbControllerBase {
  #apiModel?: T;
  public get apiModel(): T | undefined { return this.#apiModel; }

  #generatedFiles = new UmbObjectState<GeneratedFiles | undefined>(undefined);
  public get generatedFiles(): Observable<GeneratedFiles | undefined> {
    return this.#generatedFiles.asObservable();
  }

  #documentItemRepository = new UmbDocumentItemRepository(this);
	#documentBlueprintItemRepository = new UmbDocumentBlueprintItemRepository(this);

  constructor(host: UmbControllerHost) {
    super(host);
  }

  async getDefinedBlueprintIds(documentTypeUnique: string){
    const result = await this.#documentBlueprintItemRepository.requestItemsByDocumentType(documentTypeUnique);
    
    if (!result || !result.data) {
      return [];
    }

    console.log("blue data", result.data);

    return result.data?.map(d => d.unique);
  }

  hasDocumentationPage(){
    // this.#documentItemRepository.
  }

  clearApiModel() {
    this.#apiModel = undefined;
    this.#generatedFiles.setValue(undefined);
  }

  updateApiModel(apiModel: T) {
    this.#apiModel = apiModel;
    this.#generateCodeDebounced();
  }
  
  async generateCode() {
    if (!this.isValidApiModel()) {
      return;
    }

    try {
      const response = await this.sendGenerateRequest();
      this.#generatedFiles.setValue(response.data);
    } catch (error) {
      console.error("Error generating code:", error);
      return;
    }
  }

  #generateCodeDebounced = debounce(this.generateCode, 1000);

  async applyToCodebase() {
    if (!this.isValidApiModel()) {
      return;
    }

    await umbConfirmModal(this, {
        color: 'danger',
        headline: 'You are about to make changes to your codebase!',
        content: 'Please confirm that you want to add all files and folders that you have just previewed.',
        confirmLabel: 'Add files to codebase',
    });

    try {
      const response = await this.sendApplyToCodebaseRequest();

      if(response.error){
        if(response.error?.name?.indexOf("Conflict")){
            await umbConfirmModal(this, {
                color: 'danger',
                headline: 'You are about to overwrite one or more files in your codebase!',
                content: 'Please confirm that you want to overwrite files and folders that already exist.',
                confirmLabel: 'Overwrite files in codebase',
            });

            this.sendForceApplyToCodebaseRequest();
        }
      }
    } catch (error) {
      console.error("Error generating code:", error);
      return;
    }
  }

  abstract sendGenerateRequest(): Promise<UmbDataSourceResponse<GeneratedFiles>>;

  abstract sendApplyToCodebaseRequest(): Promise<UmbDataSourceResponse<string>>;

  abstract sendForceApplyToCodebaseRequest(): Promise<UmbDataSourceResponse>;

  isValidApiModel(): boolean {
    return true;
  }
}
