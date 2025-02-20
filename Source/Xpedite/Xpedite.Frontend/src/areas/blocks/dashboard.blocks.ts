import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";

import "@umbraco-cms/backoffice/code-editor";

import "../../elements/field-picker";
import "../../elements/generated-files";
import "../../elements/no-generated-files";
import "../../elements/generator-page";
import "./guide.blocks";
import "./wizard.blocks";

import { when } from "lit/directives/when.js";
import { GeneratedFiles } from "../../api";
import XpediteBlocksContext, { BLOCKS_CONTEXT_TOKEN } from "./context.blocks";

@customElement("xpedite-blocks-dashboard")
export class XpediteBlocksDashboard extends UmbElementMixin(LitElement) {
  #context?: XpediteBlocksContext;

  @state()
  _generatedFiles: GeneratedFiles | undefined;

  constructor() {
    super();

    this.consumeContext(BLOCKS_CONTEXT_TOKEN, (context) => {
      this.#context = context;

      this.observe(this.#context?.generatedFiles, (x) => {
        this._generatedFiles = x;
      });
    });
  }

  async #applyToCodebase() {
    await this.#context?.applyToCodebase();
  }

  render() {
    return html` <xpedite-generator-page>
      <xpedite-blocks-wizard slot="wizard"></xpedite-blocks-wizard>
      <div>
        ${when(
          !this._generatedFiles,
          () => html`
            <xpedite-no-generated-files class="uui-text">
              <xpedite-blocks-guide></xpedite-blocks-guide>
            </xpedite-no-generated-files>
          `
        )}
        ${when(
          this._generatedFiles,
          () => html`
            <xpedite-generated-files .value=${this._generatedFiles} @applyToCodebase=${() => this.#applyToCodebase()}> </xpedite-generated-files>
          `
        )}
      </div>
    </xpedite-generator-page>`;
  }

  static styles = [UmbTextStyles, css``];
}

export default XpediteBlocksDashboard;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-blocks-dashboard": XpediteBlocksDashboard;
  }
}
