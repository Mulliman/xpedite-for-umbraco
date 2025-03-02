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

    // style="border-color: ${this.value.colour}"

    return html`
      <uui-card>
        <div>
          <div class="icon" style="background: ${this.value.colour + "22"}">
            <uui-icon name=${this.value.icon} style="background: ${this.value.colour}"></uui-icon>
          </div>
          <div class="content">
            <h2>${this.value.name}</h2>
            <p>${this.value.description}</p>
          </div>
          <div class="buttons">
            <xpedite-create-button .value=${this.value} .isSmall=${true}></xpedite-create-button>
          </div>
        </div>
      </uui-card>
    `;
  }

  static override styles = [
    UmbTextStyles,
    css`
      uui-card {
        min-height:100%;
      }

      uui-card > div {
        min-height:100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        flex: 1;
      }

      .icon {
        text-align: center;
        background: var(--uui-color-surface-alt);
        padding: 2rem;

        uui-icon {
          padding: 1rem;
          font-size: 3rem;
          color: white;
          border-radius: 5px;
        }
      }

      .content {
        padding: var(--uui-size-space-4);
        flex-grow: 1;

        h2,
        h3 {
          margin-top: 0.5rem;
        }

        p {
          padding-bottom: 0;
          margin-bottom: 0;
          font-size: 1rem;
        }
      }

      .buttons {
        display: flex;
        padding: var(--uui-size-space-4);
        padding-top: var(--uui-size-space-2);
        justify-content: center;
        margin-top: auto;
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
