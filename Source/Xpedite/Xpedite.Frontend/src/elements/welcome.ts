import { css, html, customElement, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { Task } from "@lit/task";

import "@umbraco-cms/backoffice/code-editor";

import logo from "../_assets/logo-transparent.png";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { ConfigModel, V1Service } from "../api";
import { UmbDataSourceResponse } from "@umbraco-cms/backoffice/repository";

@customElement("xpedite-welcome")
export class XpediteWelcome extends UmbLitElement {
  constructor() {
    super();
  }

  _initTask = new Task(this, {
    task: async () => {
      return tryExecuteAndNotify(this, V1Service.getApiV1XpediteGetConfig());
    },
    args: () => ["Run"],
  });

  override render() {
    console.log("render");

    return this._initTask.render({
      error: () => {
        console.log("error");
      },
      complete: (config: UmbDataSourceResponse<ConfigModel>) => html` ${this.#renderWelcome(config.data)} `,
    });
  }

  #renderWelcome(config: ConfigModel | undefined) {
    console.log("renderWelcome", config);

    return html` <div class="welcome">
      <div class="logo"><img src=${logo} alt="XPEDITE logo" /></div>
      ${this.#renderSuccess(config)} ${this.#renderInProgress(config)}
    </div>`;
  }

  #renderSuccess(config: ConfigModel | undefined) {
    if (!config || !config.isComplete) {
      return;
    }

    return html`
      <div>
        <h2 class="success">You are completely set up!</h2>
        <ul class="info">
          <li>
            <h3>
              Your templates folder:
              <code class="file-path">${config.templatesRootFolderPath}</code>
            </h3>
          </li>
          <li>
            <h3>
              Your codebase Src folder:
              <code class="file-path">${config.codebaseSrcPath}</code>
            </h3>
          </li>
        </ul>
      </div>
    `;
  }

  #renderInProgress(config: ConfigModel | undefined) {
    if (!config || config.isComplete) {
      return;
    }

    return html`
      <div>
        <h2 class="in-progress">You are a few steps away...</h2>
        <ol class="steps">
          ${this.#renderDeliveryApiStep(config)} ${this.#renderNextJsStep(config)} ${this.#renderSrcDirectoryStep(config)}
          ${this.#renderTestingStep(config)} ${this.#renderXpediteCodeStep(config)}
        </ol>
      </div>
    `;
  }

  #renderDeliveryApiStep(config: ConfigModel) {
    const className = config.isDeliveryApiEnabled ? "done" : "";

    return html`
      <li class=${className}>
        <h3>Enable Delivery API in <code>appsettings.json</code></h3>
        <div class="help">
          <pre>
"Umbraco": {
  "CMS": {
    ...
    "DeliveryApi": {
      "Enabled": true,
      "PublicAccess": true,
      "AllowedOrigins": "*"
    }
  }
}</pre
          >
        </div>
      </li>
    `;
  }

  #renderNextJsStep(config: ConfigModel) {
    const className = config.codebaseSrcPath?.length ? "done" : "";

    return html`
      <li class=${className}>
        <h3>Run <code>npx create-next-app@latest</code> in the directory where you want to create your headless Next.js app.</h3>
        <div class="help">
          Visit the <a href="https://nextjs.org/docs/app/getting-started/installation" target="_blank">Next.js documentation</a> for options.
        </div>
      </li>
    `;
  }

  #renderSrcDirectoryStep(config: ConfigModel) {
    const className = config.codebaseSrcPath?.length ? "done" : "";

    return html`
      <li class=${className}>
        <h3>
          Configure your codebase Src directory in <code>appsettings.Development.json</code> and ensure that this website has access to the folder.
        </h3>
        <div class="help">
          <pre>
"Xpedite": {
  "CodebaseSrcPath": "c://path/to/your/codebase/src",
}</pre
          >
        </div>
      </li>
    `;
  }

  #renderTestingStep(config: ConfigModel) {
    const className = config.isReactTestingInstalled ? "done" : "";

    return html`
      <li class=${className}>
        <h3>Run <code>???</code> to install the testing dependencies</h3>
        <div class="help">Visit the <a href="#" target="_blank">Jest documentation</a> for options.</div>
      </li>
    `;
  }

  #renderXpediteCodeStep(config: ConfigModel) {
    const className = config.isXpediteTypescriptCodeInstalled ? "done" : "";

    return html`
      <li class=${className}>
        <h3>Install XPEDITE types and example components to your codebase</h3>
        <div class="help"><button>Automatically copy files to codebase</button> or copy the files you want manually from the app_plugins folder of this Umbraco instance.</div>
      </li>
    `;
  }

  static override styles = [
    UmbTextStyles,
    css`
      :host {
      }

      .welcome {
        background: linear-gradient(to top right, #090223 66%, #210223);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: var(--uui-shadow-depth-1, 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24));
        border-radius: var(--uui-border-radius, 3px);

        a {
          color: #80ccb5;
        }

        button {
          font-weight: bold;
          background: #318487;
          padding: 10px;
          color: white;
          border: none;
          border-radius: 5px;
          text-decoration: none;
          cursor: pointer;

          &:hover {
            background: #206063;
          }
        }

        .logo {
          img {
            display: block;
            max-height: 100px;
          }
        }

        h2 {
          font-size: 2rem;
          height: auto;
          line-height: normal;
        }

        .success {
          color: #80ccb5;
          background: linear-gradient(90deg, #80ccb5, #a8cca6, #80ccb5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .info {
          color: white;
          text-align: left;

          li {
            h3 {
            }

            .file-path {
              font-size: 10px;
            }
          }
        }

        .in-progress {
          color: #ccc480;
          background: linear-gradient(90deg, #ccc480, #ccc0a6, #ccc480);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .steps {
          color: white;
          text-align: left;

          li {
            padding-bottom: 40px;

            code,
            pre {
              background: black;
              border: 1px solid rgba(255, 255, 255, 0.25);
            }

            code {
              padding: 5px;
            }

            pre {
              padding: 10px;
            }

            h3 {
            }

            .help {
            }

            &.done {
              padding-bottom: 0;

              h3 {
                text-decoration: line-through;
                opacity: 0.5;
              }

              .help {
                display: none;
              }
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
