import { css, html, customElement, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { Task } from "@lit/task";

import "@umbraco-cms/backoffice/code-editor";
import "./create-button";

import logo from "../_assets/logo-transparent-big-blue.png";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { ConfigModel, V1Service } from "../api";
import { UmbDataSourceResponse } from "@umbraco-cms/backoffice/repository";
import PartialsInfo, { partialsColour, partialsIcon } from "../areas/partials/info.partials";
import BlocksInfo, { blocksColour, blocksIcon } from "../areas/blocks/info.blocks";
import TemplatesInfo, { templatesColour, templatesIcon } from "../areas/templates/info.templates";

@customElement("xpedite-welcome3")
export class XpediteWelcome3 extends UmbLitElement {
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

  override render() {
    return this._initTask.render({
      error: () => {
        console.log("error");
      },
      complete: (config: UmbDataSourceResponse<ConfigModel>) => html` ${this.#renderWelcome(config.data)} `,
    });
  }

  #renderWelcome(config: ConfigModel | undefined) {
    console.log("renderWelcome", config);

    return html` 
    <div class="logo"><img src=${logo} alt="XPEDITE logo" /></div>

      <div class="welcome">
        ${this.#renderSuccess(config)} ${this.#renderInProgress(config)}
      </div>`;
  }

  #renderSuccess(config: ConfigModel | undefined) {
    if (!config || !config.isComplete) {
      return;
    }

    return html`
      <h1 class="in-progress uui-font">Create a component</h1>
      <div class="buttons" style="margin-bottom: 0.5rem;">
        <xpedite-create-button .value=${new TemplatesInfo()}></xpedite-create-button>
        <xpedite-create-button .value=${new PartialsInfo()}></xpedite-create-button>
        <xpedite-create-button .value=${new BlocksInfo()}></xpedite-create-button>
        <!-- <button class="big" style="background:linear-gradient(to bottom left, #318487, ${templatesColour})">Create template <uui-icon name=${templatesIcon}></uui-icon></button> 
        <button class="big" style="background:linear-gradient(to top right, #318487, ${partialsColour})">Create partial <uui-icon name=${partialsIcon}></uui-icon></button> 
        <button class="big" style="background:linear-gradient(to top right, #318487, ${blocksColour})">Create block <uui-icon name=${blocksIcon}></uui-icon></button></div> -->
      <div>
        <!-- <div class="logo-title">
          <h2 class="success">You are completely set up!</h2>
        </div> -->

        <!-- <ul class="info">
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
        </ul> -->
      </div>
    `;
  }

  #renderInProgress(config: ConfigModel | undefined) {
    if (!config || config.isComplete) {
      return;
    }

    return html`
      <h1 class="in-progress uui-font">You are a few steps away...</h1>
      <div>
        <!-- <h2 class="in-progress">You are a few steps away...</h2> -->
        <ol class="steps">
          ${this.#renderDeliveryApiInstallStep(config)} ${this.#renderDeliveryApiStep(config)} ${this.#renderNextJsStep(config)}
          ${this.#renderSrcDirectoryStep(config)} ${this.#renderTestingStep(config)} ${this.#renderDotEnvStep(config)}
          ${this.#renderXpediteCodeStep(config)} ${this.#renderContentStep(config)}
        </ol>
      </div>
    `;
  }

  #renderDeliveryApiInstallStep(config: ConfigModel) {
    const className = config.isDeliveryApiInstalled ? "done" : "";

    return html`
      <li class=${className}>
        <h3>Install Delivery API in <code>Program.cs</code></h3>
        <div class="help">
          <pre>
builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddDeliveryApi()
    .AddComposers()
    .Build();</pre
          >
        </div>
      </li>
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
          <p>
            Visit the <a href="https://nextjs.org/docs/app/getting-started/installation" target="_blank">Next.js documentation</a> for options. The
            current settings used for testing in XPEDITE are:
          </p>
          <pre>
√ What is your project named? ... {Your project name}
√ Would you like to use TypeScript? ... Yes
√ Would you like to use ESLint? ... Yes
√ Would you like to use Tailwind CSS? ... No
√ Would you like your code inside a src directory? ... Yes
√ Would you like to use App Router? (recommended) ... Yes
√ Would you like to use Turbopack for? ... No
√ Would you like to customize the import alias... No</pre
          >
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
        <h3>Install the testing dependencies Jest and React Testing Library</h3>
        <div class="help">
          <pre>npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node</pre>
          <pre>
npm init jest@latest

√ Would you like to use Jest when running "test" script in "package.json"? ... yes
√ Would you like to use Typescript for the configuration file? ... yes
√ Choose the test environment that will be used for testing » jsdom (browser-like)
√ Do you want Jest to add coverage reports? ... yes
√ Which provider should be used to instrument code for coverage? » v8
√ Automatically clear mock calls, instances, contexts and results before every test? ... no</pre
          >
          <p>Add the jest types as a dev dependency so you can run the tests.</p>
          <pre>npm i -D @types/jest jest</pre>
          <p>Update <code>jest.config.ts</code> with the following settings</p>
          <pre>
import type { Config } from 'jest'
import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: "coverage",
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)</pre
          >
          <p>
            Visit the <a href="https://nextjs.org/docs/app/building-your-application/testing/jest" target="_blank">Next.js Jest documentation</a> for
            options.
          </p>
        </div>
      </li>
    `;
  }

  #renderContentStep(config: ConfigModel) {
    const className = config.isContentInPlace ? "done" : "";

    return html`
      <li class=${className}>
        <h3>Add and publish content.</h3>
        <div class="help">
          <p>If you are creating your document types and pages from scratch, make sure that they are published.</p>
          <p>Why not use the XPEDITE starter kit to add a basic structure using <code>dotnet add XPEDITE.StarterKit</code>?</p>
        </div>
      </li>
    `;
  }

  #renderDotEnvStep(config: ConfigModel) {
    const className = config.isEnvFileInstalled ? "done" : "";

    return html`
      <li class=${className}>
        <h3>Add a <code>.env</code> file to the root of your Next.js project folder.</h3>
        <div class="help">
          <p><button @click=${() => this.#createDotEnv()}>Automatically add .env file</button> or add the following to an existing file:</p>
          <pre>
UMBRACO_SERVER_URL={Your URL}
UMBRACO_DELIVERY_API_KEY={Your API KEY}
UMBRACO_HOME_ITEM={Your home page}
            </pre
          >
        </div>
      </li>
    `;
  }

  async #createDotEnv() {
    await tryExecuteAndNotify(this, V1Service.postApiV1XpediteAddEnvFile());

    this.refreshToken = new Date().toISOString();
  }

  #renderXpediteCodeStep(config: ConfigModel) {
    const className = config.isXpediteTypescriptCodeInstalled ? "done" : "";

    return html`
      <li class=${className}>
        <h3>Install XPEDITE types and example components to your codebase</h3>
        <div class="help">
          <button>Automatically copy files to codebase</button> or copy the files you want manually from the app_plugins folder of this Umbraco
          instance.
        </div>
      </li>
    `;
  }

  static override styles = [
    UmbTextStyles,
    css`
      :host {
      }

      .logo {
        text-align: center;
        margin-bottom: -65px;

        img {
          display: inline-block;
          max-height: 80px;
        }
      }

      .in-progress {
        color: white;
        background: linear-gradient(90deg, #ccc480, #ccc0a6, #ccc480);
        background: linear-gradient(to top right, #31add3, #6dddd4, #d4f5d0);
        /* background: linear-gradient(to top right, #056684 33%, #2B9088, #92C88C); */
        /* background: linear-gradient(to top right, #056684 66%, #2B9088); */
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-transform: uppercase;
        text-align: center;
        padding: 1.5rem;
        margin: 0;
        margin-top: 36px;
        /* font-weight: bold; */
        border-radius: var(--uui-border-radius, 3px);
      }

      .welcome {
        background: linear-gradient(to right top, rgb(0, 10, 10) 65%, rgb(1, 27, 27)); 
        border: 10px solid rgb(43, 144, 136);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 1rem;
        margin-bottom: 2rem;
        box-shadow: var(--uui-shadow-depth-1, 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24));
        border-radius: var(--uui-border-radius, 3px);
        border-radius: 15px;

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

        button.big {
          font-size: 1rem;
          margin: 0 5px;
          padding: 15px;

          uui-icon{
            margin-left: 5px;
          }

          &:hover {
            background: #206063!important;
          }
        }

        .logo-title {
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            max-height: 100px;
          }

          h2 {
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
          background: linear-gradient(to top right, #056684, #2b9088, #92c88c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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

        .steps {
          color: white;
          text-align: left;

          li {
            padding-bottom: 1rem;

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

export default XpediteWelcome3;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-welcome3": XpediteWelcome3;
  }
}
