import { UmbInputDocumentTypeElement } from "@umbraco-cms/backoffice/document-type";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UmbPropertyValueChangeEvent } from "@umbraco-cms/backoffice/property-editor";
import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";

import "../../elements/assistant";
import "../../elements/field-picker";

import { BlockCheckInput, CheckResult, GenerateBlockApiModel } from "../../api";
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
        testItem?: string;
      }
    | undefined;

  @state()
  _selectedFields: Array<string> = [];

  @state()
  _selectedSettings: Array<string> = [];

  // #region Construction and Deconstruction

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
      settingsTypeId: this._chosenSettingsType,
      selectedSettings: this._selectedSettings,
      testItem: this._options?.testItem
    } as GenerateBlockApiModel;

    return data;
  }

  #refreshApiModel() {
    const newModel = this.#createApiModel();

    if (newModel) {
      this.#context?.updateApiModel(newModel);
    }
  }

  #resetState() {
    this._chosenContentType = undefined;
    this._selectedFields = [];
    this.#context?.clearApiModel();
    this.#assistantContext?.clearApiModel();
  }

  // #endregion

  // #region Content Type

  #onSelectContentType(event: CustomEvent & { target: UmbInputDocumentTypeElement }) {
    const selectedType = event.target.selection[0];

    if (selectedType) {
      this._chosenContentType = selectedType;
    } else {
      this.#resetState();
    }

    this.#updateAssistant();

    this.dispatchEvent(new UmbPropertyValueChangeEvent());
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
          @change=${this.#onSelectContentType}
        ></umb-input-document-type>
      </uui-box>
    `;
  }

  // #endregion

  // #region Selected Fields

  #onSelectFields(event: CustomEvent) {
    const fieldPicker = event.target as XpediteFieldPicker;
    this._selectedFields = fieldPicker.value;

    this.#refreshApiModel();
  }

  #renderChooseFieldsStep() {
    if (!this._chosenContentType) return null;

    return html`
      <uui-box>
        <div slot="headline">Choose fields</div>

        <xpedite-field-picker @change=${this.#onSelectFields} .documentTypeId=${this!._chosenContentType}></xpedite-field-picker>
      </uui-box>
    `;
  }

  // #endregion

  // #region Settings

  #onSelectSettingsType(event: CustomEvent & { target: UmbInputDocumentTypeElement }) {
    const selectedType = event.target.selection[0];

    if (selectedType) {
      this._chosenSettingsType = selectedType;
    } else {
      this._chosenSettingsType = undefined;
      this._selectedSettings = [];
    }

    this.#updateAssistant();

    this.dispatchEvent(new UmbPropertyValueChangeEvent());
  }

  #onSelectSettings(event: CustomEvent) {
    const fieldPicker = event.target as XpediteFieldPicker;
    this._selectedSettings = fieldPicker.value;

    this.#refreshApiModel();
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
          @change=${this.#onSelectSettingsType}
        ></umb-input-document-type>
      </uui-box>
    `;
  }

  #renderChooseSettingsStep() {
    if (!this._chosenSettingsType) return null;

    return html`
      <uui-box>
        <div slot="headline">Choose settings</div>

        <xpedite-field-picker @change=${this.#onSelectSettings} .documentTypeId=${this!._chosenSettingsType}></xpedite-field-picker>
      </uui-box>
    `;
  }

  // #endregion

  // #region Options

  #onSetOptions(event: CustomEvent & { target: HTMLInputElement }, propertyName: string) {
    this._options = { ...this._options, [propertyName]: event.target.value } as { name: string; createComponentPage: boolean };

    this.dispatchEvent(new UmbPropertyValueChangeEvent());

    this.#refreshApiModel();
  }

  #onSetOptionsValue(propertyName: string, propertyValue: any) {
    this._options = {
      ...this._options,
      [propertyName]: propertyValue,
    } as { name: string; createComponentPage: boolean };

    this.dispatchEvent(new UmbPropertyValueChangeEvent());

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
              @input=${(e: CustomEvent & { target: HTMLInputElement }) => this.#onSetOptions(e, "name")}
            ></uui-input>
          </div>
        </umb-property-layout>
        <umb-property-layout label="Test Item" orientation="vertical">
          <div id="editor" slot="editor">
            <umb-input-document
              .selection=${this._options?.testItem ? [this._options?.testItem] : []}
              max="1"
              @change=${(e: CustomEvent & { target: any }) => this.#onSetOptionsValue("testItem", e.target.selection?.at(0))}
            ></umb-input-document>
          </div>
        </umb-property-layout>
      </uui-box>
    `;
  }

  // #endregion

  // #region Assistant

  #updateAssistant() {
    if (!this.#assistantContext) {
      return;
    }

    if (!this._chosenContentType) {
      this.#assistantContext.clearApiModel();
      return;
    }

    var model = {
      documentTypeId: this._chosenContentType,
      settingsTypeId: this._chosenSettingsType,
    } as BlockCheckInput;

    this.#assistantContext.updateApiModel(model);
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

  // #endregion

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
