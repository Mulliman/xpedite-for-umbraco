import { UmbInputDocumentTypeElement } from "@umbraco-cms/backoffice/document-type";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UmbPropertyValueChangeEvent } from "@umbraco-cms/backoffice/property-editor";
import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";

import "../../elements/assistant";
import "../../elements/field-picker";

import { CheckResult, GenerateBlockApiModel } from "../../api";
import XpediteFieldPicker from "../../elements/field-picker";
import XpediteBlocksContext, { BLOCKS_CONTEXT_TOKEN } from "./context.blocks";
import XpediteBlocksAssistantContext, { BLOCKS_ASSISTANT_CONTEXT_TOKEN } from "./context.blocksAssistant";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";

@customElement("xpedite-blocks-wizard")
export class XpediteBlocksWizard extends UmbElementMixin(LitElement) {
  #context?: XpediteBlocksContext;
  #assistantContext?: XpediteBlocksAssistantContext;
  #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;

  @state()
  _checks: Array<CheckResult> | undefined;

  @state()
  _chosenContentType: string | undefined;

  @state()
  _chosenSettingsType: string | undefined;

  @state()
  _options:
    | {
        name: string;
        createComponentPage: boolean;
      }
    | undefined;

  @state()
  _selectedFields: Array<string> = [];

  @state()
  _selectedSettings: Array<string> = [];

  constructor() {
    super();

    this.consumeContext(BLOCKS_CONTEXT_TOKEN, (context) => {
      this.#context = context;
    });

    this.consumeContext(BLOCKS_ASSISTANT_CONTEXT_TOKEN, (context) => {
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

  override disconnectedCallback() {
    super.disconnectedCallback();
    
    this.#context?.clearApiModel();
    this.#assistantContext?.clearApiModel();
  }

  #createApiModel() {
    if (!this._chosenContentType || !this._selectedFields?.length) {
      return;
    }

    const data = {
      documentTypeId: this._chosenContentType,
      selectedProperties: this._selectedFields,
      componentName: this._options?.name,
      settingsTypeId: this._chosenSettingsType,
      selectedSettings: this._selectedSettings,
    } as GenerateBlockApiModel;

    return data;
  }

  #resetState() {
    this._chosenContentType = undefined;
    this._selectedFields = [];
    this.#context?.clearApiModel();
    this.#assistantContext?.clearApiModel();
  }

  #selectContentType(event: CustomEvent & { target: UmbInputDocumentTypeElement }) {
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

  #setOptions(event: CustomEvent & { target: HTMLInputElement }, propertyName: string) {
    this._options = { ...this._options, [propertyName]: event.target.value } as { name: string; createComponentPage: boolean };

    this.dispatchEvent(new UmbPropertyValueChangeEvent());

    this.#refreshApiModel();
  }

  #selectFields(event: CustomEvent) {
    const fieldPicker = event.target as XpediteFieldPicker;
    this._selectedFields = fieldPicker.value;

    this.#refreshApiModel();
  }

  #refreshApiModel() {
    const newModel = this.#createApiModel();

    if (newModel) {
      this.#context?.updateApiModel(newModel);
    }
  }

  #selectSettingsType(event: CustomEvent & { target: UmbInputDocumentTypeElement }) {
    const selectedType = event.target.selection[0];

    if (selectedType) {
      this._chosenSettingsType = selectedType;
    } else {
      this._chosenSettingsType = undefined;
      this._selectedSettings = [];
    }

    this.dispatchEvent(new UmbPropertyValueChangeEvent());
  }

  #selectSettings(event: CustomEvent) {
    const fieldPicker = event.target as XpediteFieldPicker;
    this._selectedSettings = fieldPicker.value;

    this.#refreshApiModel();
  }

  #renderOptionsStep() {
    if (!this._chosenContentType) return null;

    return html`
      <uui-box class="card-gap" headline="Options">
        <umb-property-layout label="Component name" orientation="vertical">
          <div id="editor" slot="editor">
            <uui-input
              label="Name"
              placeholder="Enter name"
              @input=${(e: CustomEvent & { target: HTMLInputElement }) => this.#setOptions(e, "name")}
            ></uui-input>
          </div>
        </umb-property-layout>
      </uui-box>
    `;
  }

  #renderChooseDocumentTypeStep() {
    return html`
      <uui-box>
        <div slot="headline">Choose existing Document Type</div>

        <umb-input-document-type
          .elementTypesOnly=${true}
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

  #renderChooseSettingsDocumentTypeStep() {
    return html`
      <uui-box>
        <div slot="headline">Choose settings Document Type</div>

        <umb-input-document-type
          .elementTypesOnly=${true}
          .selection=${this._chosenSettingsType ? [this._chosenSettingsType] : []}
          max="1"
          min="1"
          @change=${this.#selectSettingsType}
        ></umb-input-document-type>
      </uui-box>
    `;
  }

  #renderChooseSettingsStep() {
    if (!this._chosenSettingsType) return null;

    return html`
      <uui-box>
        <div slot="headline">Choose settings</div>

        <xpedite-field-picker @change=${this.#selectSettings} .documentTypeId=${this!._chosenSettingsType}></xpedite-field-picker>
      </uui-box>
    `;
  }

  async #handleAction(actionName: string) {
    if (this.#assistantContext) {
      await this.#assistantContext.runAction(actionName);

      if (this.#notificationContext) {
        this.#notificationContext.peek("positive", {
          data: {
            headline: "Success",
            message: "Action completed",
          },
        });
      }
    }
  }

  render() {
    return html`
      <div>
        <xpedite-assistant
          title="Blocks Assistant"
          .checks=${this._checks}
          @runAction=${(e: CustomEvent) => this.#handleAction(e.detail)}
        ></xpedite-assistant>
        ${this.#renderChooseDocumentTypeStep()} ${this.#renderChooseFieldsStep()} ${this.#renderChooseSettingsDocumentTypeStep()}
        ${this.#renderChooseSettingsStep()} ${this.#renderOptionsStep()}
      </div>
    `;
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

export default XpediteBlocksWizard;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-blocks-wizard": XpediteBlocksWizard;
  }
}
