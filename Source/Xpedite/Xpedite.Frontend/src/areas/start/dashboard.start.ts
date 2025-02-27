import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import TemplatesInfo from "../templates/info.templates";
import { IGeneratorInfo } from "../../IGeneratorInfo";

import "../../elements/generator-card";
import "../../elements/welcome";
import "../../elements/welcome2";
import "../../elements/welcome3";
import PartialsInfo from "../partials/info.partials";
import BlocksInfo from "../blocks/info.blocks";

@customElement("xpedite-start-dashboard")
export class XpediteStartDashboard extends UmbElementMixin(LitElement) {
  generators: Array<IGeneratorInfo> = [new TemplatesInfo(), new PartialsInfo(), new BlocksInfo()];

  constructor() {
    super();
  }

  // createRenderRoot() {
  //   return this.attachShadow({ mode: 'open' });
  // }

  render() {
    var generators = this.generators.map((generator) => html`<div class="card"><xpedite-generator-card .value=${generator}></xpedite-generator-card></div>`);

    return html`
      <umb-body-layout>
      <xpedite-welcome3></xpedite-welcome3>
      <!-- <xpedite-welcome2></xpedite-welcome2> -->
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

      .card{
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
