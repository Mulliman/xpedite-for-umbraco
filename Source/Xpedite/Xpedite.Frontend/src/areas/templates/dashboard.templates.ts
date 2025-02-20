import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";

import "@umbraco-cms/backoffice/code-editor";

import "../../elements/field-picker";
import "../../elements/generated-files";
import "../../elements/no-generated-files";
import "../../elements/generator-page";
import "./guide.templates";
import "./wizard.templates";

import { when } from "lit/directives/when.js";
import { GeneratedFiles } from "../../api";
import { TEMPLATES_CONTEXT_TOKEN, XpediteTemplatesContext } from "./context.templates";

@customElement("xpedite-templates-dashboard")
export class XpediteTemplatesDashboard extends UmbElementMixin(LitElement) {
  #context?: XpediteTemplatesContext;

  @state()
  _generatedFiles: GeneratedFiles | undefined;

  constructor() {
    super();

    this.consumeContext(TEMPLATES_CONTEXT_TOKEN, (context) => {
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
      <xpedite-templates-wizard slot="wizard"></xpedite-templates-wizard>
      <div>
        ${when(
          !this._generatedFiles,
          () => html`
            <xpedite-no-generated-files class="uui-text">
              <xpedite-templates-guide></xpedite-templates-guide>
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

export default XpediteTemplatesDashboard;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-templates-dashboard": XpediteTemplatesDashboard;
  }
}
