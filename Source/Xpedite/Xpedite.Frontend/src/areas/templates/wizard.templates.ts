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

@customElement("xpedite-templates-wizard")
export class XpediteTemplatesWizard extends UmbElementMixin(LitElement) {
  #context?: XpediteTemplatesContext;

  @state()
  _chosenContentType: string | undefined;

  @state()
  _selectedFields: Array<string> = [];

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

  #selectContentType(event: CustomEvent & { target: UmbInputDocumentTypeElement }) {
    const selectedType = event.target.selection[0];

    if (selectedType) {
      this._chosenContentType = selectedType;
    } else {
      this._chosenContentType = undefined;
      this._selectedFields = [];
      this.#context?.clearApiModel();
    }

    this.dispatchEvent(new UmbPropertyValueChangeEvent());
  }

  #selectFields(event: CustomEvent) {
    const fieldPicker = event.target as XpediteFieldPicker;
    this._selectedFields = fieldPicker.value;

    const newModel = this.#createApiModel();

    if(newModel){
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

  render() {
    return html` <div>${this.#renderChooseDocumentTypeStep()} ${this.#renderChooseFieldsStep()}</div> `;
  }

  static styles = [UmbTextStyles, css``];
}

export default XpediteTemplatesWizard;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-templates-wizard": XpediteTemplatesWizard;
  }
}
