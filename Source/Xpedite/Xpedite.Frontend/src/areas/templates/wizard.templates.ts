import { UmbInputDocumentTypeElement } from "@umbraco-cms/backoffice/document-type";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UmbPropertyValueChangeEvent } from "@umbraco-cms/backoffice/property-editor";
import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";

import "../../elements/field-picker";

import { CheckResult, GenerateApiModel } from "../../api";
import XpediteFieldPicker from "../../elements/field-picker";
import XpediteTemplatesContext, { TEMPLATES_CONTEXT_TOKEN } from "./context.templates";
import { XpediteStyles } from "../../styles";
import { templatesIcon } from "./info.templates";
import XpediteTemplatesAssistantContext, { TEMPLATES_ASSISTANT_CONTEXT_TOKEN } from "./context.templatesAssistant";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";

@customElement("xpedite-templates-wizard")
export class XpediteTemplatesWizard extends UmbElementMixin(LitElement) {
  #context?: XpediteTemplatesContext;
  #assistantContext?: XpediteTemplatesAssistantContext;
  #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;

  @state()
  _chosenContentType: string | undefined;

  @state()
  _selectedFields: Array<string> = [];

  @state()
  _checks: Array<CheckResult> | undefined;

  constructor() {
    super();

    this.consumeContext(TEMPLATES_CONTEXT_TOKEN, (context) => {
      this.#context = context;
    });

    this.consumeContext(TEMPLATES_ASSISTANT_CONTEXT_TOKEN, (context) => {
      this.#assistantContext = context;

      this.observe(this.#assistantContext?.checks, (x) => {
        this._checks = x;
      });
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (instance) => {
      this.#notificationContext = instance;
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
    this._chosenContentType = undefined;
    this._selectedFields = [];
    this.#context?.clearApiModel();
    this.#assistantContext?.clearApiModel();
  }

  async #selectContentType(event: CustomEvent & { target: UmbInputDocumentTypeElement }) {
    const selectedType = event.target.selection[0];

    if (selectedType) {
      this._chosenContentType = selectedType;

      if (this.#assistantContext) {
        this.#assistantContext.updateApiModel({ documentTypeId: selectedType });
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

    if (!this._checks) {
      return html`<p>No suggestions at this time</p>`;
    }

    const actions = this._checks.map((c) => this.#createAction(c));

    return html`<div class="x-actions">${actions}</div>`;
  }

  #createAction(action: CheckResult) {
    const iconName = action?.isOk ? "icon-check" : "icon-alert";
    const icon = html`<uui-icon name=${iconName}></uui-icon>`;
    const text = html`<span>${action?.message}</span>`;
    const buttonOrLink = this.#createButtonOrLink(action);

    return html`<div>${icon}${text}${buttonOrLink}</div>`;
  }

  #createButtonOrLink(action: CheckResult) {
    if (!action || !action?.actionButtonText) {
      return null;
    }

    if (action.actionUrl) {
      return html`<a href=${action.actionUrl} target="_blank" class="x-button-tertiary">${action.actionButtonText}</a>`;
    }

    if (action.actionName) {
      return html`<button @click=${() => this.#handleAction(action.actionName!)} class="x-button-secondary">${action.actionButtonText}</button>`;
    }

    return null;
  }

  async #handleAction(actionName: string) {
    if (this.#assistantContext) {
      await this.#assistantContext.runAction(actionName);

      if(this.#notificationContext){
        this.#notificationContext.peek("positive", {
          data: {
            headline: "Success",
            message: "Action completed"
          }
        });
      }
    }
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
            <uui-icon name="icon-wand"></uui-icon>
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
