import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import TemplatesInfo from "../templates/info.templates";
import { IGeneratorInfo } from "../../IGeneratorInfo";

import "../../elements/generator-card";
import PartialsInfo from "../partials/info.partials";
import BlocksInfo from "../blocks/info.blocks";

@customElement("xpedite-start-dashboard")
export class XpediteStartDashboard extends UmbElementMixin(LitElement) {
  generators: Array<IGeneratorInfo> = [
    new TemplatesInfo(),
    new PartialsInfo(),
    new BlocksInfo()
  ] 

  constructor() {
    super();
  }

  render() {
    var generators = this.generators.map(generator => html`<xpedite-generator-card .value=${generator}></xpedite-generator-card>`);

    return html`
      <umb-body-layout>
        ${generators}

      </umb-body-layout> `;
  }

  static styles = css``;
}

export default XpediteStartDashboard;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-start-dashboard": XpediteStartDashboard;
  }
}
