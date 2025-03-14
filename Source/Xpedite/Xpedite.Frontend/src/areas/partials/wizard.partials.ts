import { UmbInputDocumentTypeElement } from "@umbraco-cms/backoffice/document-type";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UmbPropertyValueChangeEvent } from "@umbraco-cms/backoffice/property-editor";
import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";

import "../../elements/field-picker";

import { GenerateApiModel } from "../../api";
import XpediteFieldPicker from "../../elements/field-picker";
import XpeditePartialsContext, { PARTIALS_CONTEXT_TOKEN } from "./context.partials";
import { UUIBooleanInputEvent } from "@umbraco-cms/backoffice/external/uui";

@customElement("xpedite-partials-wizard")
export class XpeditePartialsWizard extends UmbElementMixin(LitElement) {
  #context?: XpeditePartialsContext;

  @state()
  _chosenContentType: string | undefined;

  @state()
  _selectedFields: Array<string> = [];

  @state()
  _options:
    | {
        name: string;
        variant?: string;
        testItem?: string;
      }
    | undefined;

  // #region Construction and Deconstruction

  constructor() {
    super();

    this.consumeContext(PARTIALS_CONTEXT_TOKEN, (context) => {
      this.#context = context;
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    
    this.#context?.clearApiModel();
  }

  // #endregion

  // #region Content Type

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

  #renderChooseDocumentTypeStep() {
    return html`
      <uui-box>
        <div slot="headline">Choose existing Document Type</div>

        <umb-input-document-type
          .documentTypesOnly=${false}
          .selection=${this._chosenContentType ? [this._chosenContentType] : []}
          max="1"
          min="1"
          @change=${this.#selectContentType}
        ></umb-input-document-type>
      </uui-box>
    `;
  }

  // #endregion

  // #region Selected Fields

  #selectFields(event: CustomEvent) {
    const fieldPicker = event.target as XpediteFieldPicker;
    this._selectedFields = fieldPicker.value;

    this.#refreshApiModel();
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

  // #endregion

  // #region Options

  #onSetOptions(event: CustomEvent & { target: HTMLInputElement }, propertyName: string) {
    this.#onSetOptionsValue(propertyName, event.target.value);
  }

  #onSetOptionsValue(propertyName: string, propertyValue: any) {
    this._options = {
      ...this._options,
      [propertyName]: propertyValue,
    } as { name: string; };

    this.dispatchEvent(new UmbPropertyValueChangeEvent());

    this.#refreshApiModel();
  }

  #onVariantChange(event: UUIBooleanInputEvent) {
    var variant = event.target.checked ? "includingPageData" : undefined;

    this.#onSetOptionsValue("variant", variant);
  }

  #renderOptionsStep() {
    if (!this._chosenContentType) return null;

    return html`
      <div class="card-gap">
        <uui-box headline="Options">
          <umb-property-layout label="Component name" orientation="vertical">
            <div id="editor" slot="editor">
              <uui-input
                label="Name"
                placeholder="Enter name"
                @input=${(e: CustomEvent & { target: HTMLInputElement }) => this.#onSetOptions(e, "name")}
              ></uui-input>
            </div>
          </umb-property-layout>

          <umb-property-layout label="Include generic page data" orientation="vertical">
            <div id="editor" slot="editor">
              <uui-toggle .checked=${this._options?.variant == "includingPageData"} @change=${(e: UUIBooleanInputEvent) => this.#onVariantChange(e)}>
              </uui-toggle>
            </div>
          </umb-property-layout>

          <umb-property-layout label="Test Item" orientation="vertical">
            <div id="editor" slot="editor">
              <umb-input-document
                .selection=${(this._options?.testItem ? [this._options?.testItem] : [])}
                max=1
                @change=${(e: CustomEvent & { target: any }) => this.#onSetOptionsValue("testItem", e.target.selection?.at(0))}
              ></umb-input-document>
            </div>
          </umb-property-layout>
        </uui-box>
      </div>
    `;
  }

  // #endregion

  // #region API Model

  #createApiModel() {
    if (!this._chosenContentType || !this._selectedFields?.length) {
      return;
    }

    const data = {
      documentTypeId: this._chosenContentType,
      selectedProperties: this._selectedFields,
      componentName: this._options?.name,
      variantName: this._options?.variant,
      testItem: this._options?.testItem,
    } as GenerateApiModel;

    return data;
  }

  #refreshApiModel() {
    const newModel = this.#createApiModel();

    if (newModel) {
      this.#context?.updateApiModel(newModel);
    }
  }

  // #endregion

  render() {
    return html` <div>${this.#renderChooseDocumentTypeStep()} ${this.#renderChooseFieldsStep()} ${this.#renderOptionsStep()}</div> `;
  }

  static styles = [
    UmbTextStyles,
    css`
      .card-gap {
        margin-top: 16px;
      }

      umb-property-layout:first-child {
        padding-top: 0;
      }

      umb-property-layout:last-child {
        padding-bottom: 0;
      }
    `,
  ];
}

export default XpeditePartialsWizard;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-partials-wizard": XpeditePartialsWizard;
  }
}
