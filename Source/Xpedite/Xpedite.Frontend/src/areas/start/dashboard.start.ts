import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import TemplatesInfo from "../templates/info.templates";
import { IGeneratorInfo } from "../../IGeneratorInfo";

import "../../elements/generator-card";
import "../../elements/welcome";
import PartialsInfo from "../partials/info.partials";
import BlocksInfo from "../blocks/info.blocks";

@customElement("xpedite-start-dashboard")
export class XpediteStartDashboard extends UmbElementMixin(LitElement) {
  generators: Array<IGeneratorInfo> = [new TemplatesInfo(), new PartialsInfo(), new BlocksInfo()];

  constructor() {
    super();
  }
  
  render() {
    var generators = this.generators.map((generator) => html`<xpedite-generator-card .value=${generator}></xpedite-generator-card>`);

    return html`
      <umb-body-layout>
      <xpedite-welcome></xpedite-welcome>
        <div class="generators-grid">
          ${generators}
        </div>
      </umb-body-layout>
    `;
  }

  static styles = css`
    .generators-grid{
      display: flex;
      flex-wrap: nowrap;
      gap: 16px;
      align-items: stretch;

      xpedite-generator-card{
        flex-basis: 33.33%; 
      }
    }
  `;
}

export default XpediteStartDashboard;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-start-dashboard": XpediteStartDashboard;
  }
}
