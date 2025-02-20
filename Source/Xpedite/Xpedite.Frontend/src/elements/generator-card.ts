import { css, html, customElement, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";

import "@umbraco-cms/backoffice/code-editor";
import { IGeneratorInfo } from "../IGeneratorInfo";

@customElement("xpedite-generator-card")
export class XpediteGeneratorCard extends UmbLitElement {

  @property({ type: Object })
  value?: IGeneratorInfo;

  constructor() {
    super();
  }

  override render() {
    if (!this.value) return null;

    return html`
      <uui-card-block-type name=${this.value.name} description=${this.value.description} href=${this.value.url}>
        <uui-icon name=${this.value.icon}></uui-icon>
      </uui-card-block-type>
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

export default XpediteGeneratorCard;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-generator-card": XpediteGeneratorCard;
  }
}
