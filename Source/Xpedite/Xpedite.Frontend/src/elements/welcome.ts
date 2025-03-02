import { css, html, customElement, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { Task } from "@lit/task";

import "@umbraco-cms/backoffice/code-editor";
import "./create-button";
import "./welcome-steps";

import logo from "../_assets/logo-transparent-big-blue.png";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { ConfigModel, V1Service } from "../api";
import { UmbDataSourceResponse } from "@umbraco-cms/backoffice/repository";
import PartialsInfo from "../areas/partials/info.partials";
import BlocksInfo from "../areas/blocks/info.blocks";
import TemplatesInfo from "../areas/templates/info.templates";
import { XpediteStyles } from "../styles";

@customElement("xpedite-welcome")
export class XpediteWelcome extends UmbLitElement {
  @state()
  refreshToken: string = "FirstLoad";

  constructor() {
    super();
  }

  _initTask = new Task(this, {
    task: async () => {
      return tryExecuteAndNotify(this, V1Service.getApiV1XpediteGetConfig());
    },
    args: () => [this.refreshToken],
  });

  #refresh() {
    this.refreshToken = new Date().toISOString();
  }

  override render() {
    return this._initTask.render({
      error: () => {
        console.log("error");
      },
      complete: (config: UmbDataSourceResponse<ConfigModel>) => html` ${this.#renderWelcome(config.data)} `,
    });
  }

  #renderWelcome(config: ConfigModel | undefined) {
    const sectionToShow = config?.isComplete
      ? this.#renderSuccess(config)
      : html`<xpedite-welcome-steps .config=${config} @stepCompleted=${() => this.#refresh()}></xpedite-welcome-steps>`;

    return html` <div class="welcome primary-container">
      <div class="logo"><img src=${logo} alt="XPEDITE logo" /></div>
      ${sectionToShow}
    </div>`;
  }

  #renderSuccess(config: ConfigModel | undefined) {
    if (!config || !config.isComplete) {
      return;
    }

    return html`
      <h1 class="x-text-gradient-light uui-font">Create a component</h1>
      <div class="buttons">
        <xpedite-create-button .value=${new TemplatesInfo()}></xpedite-create-button>
        <xpedite-create-button .value=${new PartialsInfo()}></xpedite-create-button>
        <xpedite-create-button .value=${new BlocksInfo()}></xpedite-create-button>
      </div>
    `;
  }

  static override styles = [
    UmbTextStyles,
    XpediteStyles,
    css`
      :host {
      }

      .welcome {
        margin-top: 2rem;

        h1{
          margin: 1rem 0 1.5rem;
        }

        .buttons {
          margin-bottom: 1rem;
        }

        .info {
          color: white;
          text-align: left;
          list-style-type: none;

          li {
            h3 {
            }

            .file-path {
              display: block;
              font-size: 10px;
              background: rgba(0, 0, 0, 0.75);
              padding: 0.25rem 0.5rem;
              border: 1px solid rgba(255, 255, 255, 0.25);
            }
          }
        }
      }
    `,
  ];
}

export default XpediteWelcome;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-welcome": XpediteWelcome;
  }
}
