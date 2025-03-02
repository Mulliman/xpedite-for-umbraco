import { css, html, customElement } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';

import "@umbraco-cms/backoffice/code-editor";

@customElement("xpedite-no-generated-files")
export class XpediteNoGeneratedFiles extends UmbLitElement {
  constructor() {
    super();
  }

  override render() {
    return html`
        <slot></slot>
    `;
  }

  static override styles = [
    UmbTextStyles,
    css`
      :host {
        display: block;
        text-align: center;
        border: 2px dashed var(--uui-color-border-emphasis);
        padding: var(--uui-size-space-5);
        padding-top: var(--uui-size-space-6);
        border-radius: var(--uui-size-space-4);
      }
    `,
  ];
}

export default XpediteNoGeneratedFiles;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-no-generated-files": XpediteNoGeneratedFiles;
  }
}
