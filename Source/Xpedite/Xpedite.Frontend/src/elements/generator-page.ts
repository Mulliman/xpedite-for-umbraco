import { css, html, customElement } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";

@customElement("xpedite-generator-page")
export class XpediteGeneratorPage extends UmbLitElement {
  constructor() {
    super();
  }

  override render() {
    return html`
      <umb-body-layout>
        <div class="generator-page-grid">
          <slot name="wizard"></slot>
          <slot></slot>
        </div>
      </umb-body-layout>
    `;
  }

  static override styles = [
    UmbTextStyles,
    css`
      :host {
        .generator-page-grid {
          display: grid;
          grid-template-columns: 400px 1fr;
          grid-gap: 1rem;
        }
      }
    `,
  ];
}

export default XpediteGeneratorPage;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-generator-page": XpediteGeneratorPage;
  }
}
