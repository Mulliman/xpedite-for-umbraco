import { css, html, customElement, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";

import "@umbraco-cms/backoffice/code-editor";
import { IGeneratorInfo } from "../IGeneratorInfo";

import './big-card';

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
      <xpedite-big-card name=${this.value.name} description=${this.value.description} href=${this.value.url}>
        <uui-icon name=${this.value.icon} style="color: #92C98C"></uui-icon>
      </xpedite-big-card>
    `;
  }

  static override styles = [
    UmbTextStyles,
    css`
      :host {
      }

      uui-icon {
        font-size: 3rem;
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
