import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";
import { css, html, customElement, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { GeneratedFiles } from "../api";
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';

import { downloadAsFile, downloadAsZip } from "../services/files";

import "@umbraco-cms/backoffice/code-editor";

@customElement("xpedite-download-button")
export class XpediteDownloadButton extends UmbLitElement {
  private _value: GeneratedFiles | undefined;

  @property({ type: Object })
  public set value(val: GeneratedFiles | undefined) {
    const oldVal = this._value;
    this._value = val;

    this.requestUpdate("value", oldVal);
    this.dispatchEvent(new UmbChangeEvent());
  }
  public get value(): GeneratedFiles | undefined {
    return this._value;
  }

  constructor() {
    super();
  }

  async #onClick() {
    if(!this.value?.files) return;

    const hasMultipleFiles = this.value.files.length > 1;

    if(hasMultipleFiles){
        const mappedFiles = this.value.files.map(f => ({ content: f.contents, filePath: f.relativeFilePath }));
        const zipName = `${this.value.groupName || "xpedite-files"}.zip`;

        await downloadAsZip(mappedFiles, zipName);
    } else {
        if (this.value.files[0]?.fileName) {
            downloadAsFile(this.value.files[0].contents, this.value.files[0].fileName);
        } else {
          alert("There are no files to download.");
        }
    }
  }

  override render() {
    if(!this.value) return null;

    return html`
        <uui-button pristine="" label="Download" color="warning" look="primary" @click=${() => this.#onClick()}>Download</uui-button>
    `;
  }

  static override styles = [
    UmbTextStyles,
    css`
      :host {
      }
    `,
  ];
}

export default XpediteDownloadButton;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-download-button": XpediteDownloadButton;
  }
}
