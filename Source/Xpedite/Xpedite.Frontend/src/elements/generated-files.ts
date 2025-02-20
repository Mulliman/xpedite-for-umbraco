import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";
import {
  css,
  html,
  customElement,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { GeneratedFiles } from "../api";

import "./download-button";

import "@umbraco-cms/backoffice/code-editor";

@customElement("xpedite-generated-files")
export class XpediteGeneratedFiles extends UmbLitElement {
  private _value: GeneratedFiles | undefined;

  @property({ type: Object })
  public set value(val: GeneratedFiles | undefined) {
    const oldVal = this._value;
    this._value = val;

    if (this._value?.files?.length) {
      this._visibleFile = this._value.files[0].relativeFilePath;
    }

    this.requestUpdate("value", oldVal);
    this.dispatchEvent(new UmbChangeEvent());
  }
  public get value(): GeneratedFiles | undefined {
    return this._value;
  }

  @state()
  private _visibleFile: string | undefined;

  private _triggerApplyToCodebase() {
    this.dispatchEvent(
      new CustomEvent("applyToCodebase", {
        bubbles: true,
        composed: true,
      })
    );
  }

  constructor() {
    super();
  }

  #onFileSelected(filePath: string) {
    this._visibleFile = filePath;
  }

  override render() {
    if (!this.value?.files) return null;

    return html`
      <uui-box>
        <div slot="headline">Generated files</div>
        <div slot="header-actions">
          <xpedite-download-button .value=${this.value}></xpedite-download-button>
          <uui-button pristine="" label="Apply to codebase" color="danger" look="primary" @click=${() => this._triggerApplyToCodebase()}>Apply to codebase</uui-button>
        </div>

        <div class="generated-files">
          <div class="file-list">
            <uui-menu>
              ${this._value?.files.map(
                (file) => html`
                  <uui-menu-item
                    label=${file.relativeFilePath}
                    ?active=${file.relativeFilePath === this._visibleFile}
                    @click=${() => this.#onFileSelected(file.relativeFilePath)}
                  ></uui-menu-item>
                `
              )}
            </uui-menu>
          </div>

          <div class="code-editor">
            <umb-code-editor
              language="typescript"
              ?readonly=${true}
              .code=${this.value.files.find((f) => f.relativeFilePath == this._visibleFile)?.contents || ''}
            ></umb-code-editor>
          </div>
        </div>
      </uui-box>
    `;
  }

  static override styles = [
    css`
      :host {
        display: block;
      }

      .generated-files {
        display: flex;
        flex-direction: row;
        position: relative;
        width: 100%;

        >div {
          display: flex;
        }

        .file-list {
          width: 300px;

          uui-menu {
            width: 300px;
          }
        }

        .code-editor {
          flex: 1;

          umb-code-editor {
            width: 100%;
          }
        }
      }
    `,
  ];
}

export default XpediteGeneratedFiles;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-generated-files": XpediteGeneratedFiles;
  }
}
