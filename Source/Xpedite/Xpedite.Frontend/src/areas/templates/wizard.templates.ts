import { UmbInputDocumentTypeElement } from "@umbraco-cms/backoffice/document-type";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UmbPropertyValueChangeEvent } from "@umbraco-cms/backoffice/property-editor";
import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";

import "../../elements/field-picker";

import { GenerateApiModel } from "../../api";
import XpediteFieldPicker from "../../elements/field-picker";
import XpediteTemplatesContext, { TEMPLATES_CONTEXT_TOKEN } from "./context.templates";
import { XpediteStyles } from "../../styles";
import { templatesIcon } from "./info.templates";
import { templatesColour } from "../../styles/colours";

@customElement("xpedite-templates-wizard")
export class XpediteTemplatesWizard extends UmbElementMixin(LitElement) {
  #context?: XpediteTemplatesContext;

  @state()
  _chosenContentType: string | undefined;

  @state()
  _selectedFields: Array<string> = [];

  @state()
  _blueprints: string[] = [];

  constructor() {
    super();

    this.consumeContext(TEMPLATES_CONTEXT_TOKEN, (context) => {
      this.#context = context;
    });
  }

  #createApiModel() {
    if (!this._chosenContentType || !this._selectedFields?.length) {
      return;
    }

    const data = {
      documentTypeId: this._chosenContentType,
      selectedProperties: this._selectedFields,
    } as GenerateApiModel;

    return data;
  }

  #resetState() {
    this._blueprints = [];
    this._chosenContentType = undefined;
    this._selectedFields = [];
    this.#context?.clearApiModel();
  }

  async #selectContentType(event: CustomEvent & { target: UmbInputDocumentTypeElement }) {
    const selectedType = event.target.selection[0];

    if (selectedType) {
      this._chosenContentType = selectedType;

      if (this.#context) {
        this._blueprints = await this.#context.getDefinedBlueprintIds(this._chosenContentType);
      }
    } else {
      this.#resetState();
    }

    this.dispatchEvent(new UmbPropertyValueChangeEvent());
  }

  #selectFields(event: CustomEvent) {
    const fieldPicker = event.target as XpediteFieldPicker;
    this._selectedFields = fieldPicker.value;

    const newModel = this.#createApiModel();

    if (newModel) {
      this.#context?.updateApiModel(newModel);
    }
  }

  #renderChooseDocumentTypeStep() {
    return html`
      <uui-box>
        <div slot="headline">Choose existing Document Type</div>

        <umb-input-document-type
          .documentTypesOnly=${true}
          .selection=${this._chosenContentType ? [this._chosenContentType] : []}
          max="1"
          min="1"
          @change=${this.#selectContentType}
        ></umb-input-document-type>
      </uui-box>
    `;
  }

  #renderChooseFieldsStep() {
    if (!this._chosenContentType) return null;

    return html`
      <uui-box>
        <div slot="headline">Choose fields</div>
        <xpedite-field-picker @change=${this.#selectFields} .documentTypeId=${this!._chosenContentType}></xpedite-field-picker>
      </uui-box>
    `;
  }

  #renderSmartActions() {
    if (!this._chosenContentType) {
      return html`<p>Select a document type for more options</p>`;
    }

    
    return html`<div class="x-actions">${this.#getBlueprintAction()}</div>`;
  }

  #getBlueprintAction(){
    if(!this._blueprints?.length){
      return html`<div><uui-icon name="icon-alert"></uui-icon><span>No blueprint created</span><button class="x-button-secondary">Create</button></div>`;
    }

    console.log("getBlueprintAction", this._blueprints);

    if(this._blueprints.length > 1){
      return html`<div><uui-icon name="icon-check"></uui-icon><span>Has multiple blueprints configured</span></div>`;
    }

    const singleId = this._blueprints[0];
    const linkUrl = `/umbraco/section/settings/workspace/document-blueprint/edit/${singleId}/invariant/tab/content`;

    return html`<div><uui-icon name="icon-check"></uui-icon><span>Has blueprint configured</span><a href=${linkUrl} target="_blank" class="x-button-tertiary">Open</a></div>`;
  }

  //x-text-gradient-light
  // style="background: ${templatesColour} uui-text

  render() {
    return html`
      <div>
        <div class="secondary-container ">
          <div class="heading">
            <!-- <h3 class="">Templates</h3> -->
            <h2 class="x-text-gradient-light uui-font">Templates Assistant</h2>
            <uui-icon name=${templatesIcon}></uui-icon>
          </div>
          <div class="content">${this.#renderSmartActions()}</div>
        </div>
        ${this.#renderChooseDocumentTypeStep()} ${this.#renderChooseFieldsStep()}
      </div>
    `;
  }

  static styles = [UmbTextStyles, XpediteStyles, css``];
}

export default XpediteTemplatesWizard;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-templates-wizard": XpediteTemplatesWizard;
  }
}
