import { css, html, customElement, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";

import "@umbraco-cms/backoffice/code-editor";
import { IGeneratorInfo } from "../IGeneratorInfo";

@customElement("xpedite-create-button")
export class XpediteCreateButton extends UmbLitElement {
  @property({ type: Object })
  public value: IGeneratorInfo;

  @property({ type: Boolean})
  public isSmall: boolean = false;

  constructor(value: IGeneratorInfo) {
    super();

    this.value = value;
  }

  override render() {
    if (!this.value) return null;

    const icon = this.isSmall ? html`` : html`<uui-icon name=${this.value.icon}></uui-icon>`;

    return html`
      <a href=${this.value.url} class=${this.isSmall && "small"} style="background:linear-gradient(to top right, #318487, ${this.value.colour})">
        ${icon}Create ${this.value.name.slice(0, -1)}<uui-icon name="icon-arrow-right"></uui-icon>
      </a>
    `;
  }

static override styles = [
    UmbTextStyles,
    css`
        :host {
        }

        a {
            display: inline-flex;
            align-items: center;
            font-weight: bold;
            background: #318487;
            color: white;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            cursor: pointer;
            font-size: 1rem;
            margin: 0 5px;
            padding: 15px;
            vertical-align: middle;

            uui-icon {
                margin: 0 10px;
                font-size: 1.6rem
            }

            &:hover {
                background: #206063 !important;
                color: white;
            }

            &.small{
              padding: 10px;
              margin: 0;
              
              uui-icon {                
                font-size: 1rem;
                
              }
            }
        }
    `,
];
}

export default XpediteCreateButton;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-create-button": XpediteCreateButton;
  }
}
