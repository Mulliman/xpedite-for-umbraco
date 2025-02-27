import { css, html, customElement, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { Task } from "@lit/task";

import "@umbraco-cms/backoffice/code-editor";

import logo from "../_assets/logo-transparent.png";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { ConfigModel, V1Service } from "../api";
import { UmbDataSourceResponse } from "@umbraco-cms/backoffice/repository";

@customElement("xpedite-welcome2")
export class XpediteWelcome2 extends UmbLitElement {
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

    return html` <div class="welcome uui-text">
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
        <div class="logo-title">
          <img src=${logo} alt="XPEDITE logo" />
          <h2 class="success">You are completely set up!</h2>
        </div>

        <ul class="info">
          <li>
            <h5>
              Your templates folder:
              <code class="file-path">${config.templatesRootFolderPath}</code>
            </h5>
          </li>
          <li>
            <h5>
              Your codebase Src folder:
              <code class="file-path">${config.codebaseSrcPath}</code>
            </h5>
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
        <h3 class="in-progress">You are a few steps away...</h3>
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
        <h5>Install Delivery API in <code>Program.cs</code></h5>
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
        <h5>Enable Delivery API in <code>appsettings.json</code></h5>
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
        <h5>Run <code>npx create-next-app@latest</code> in the directory where you want to create your headless Next.js app.</h5>
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
        <h5>
          Configure your codebase Src directory in <code>appsettings.Development.json</code> and ensure that this website has access to the folder.
        </h5>
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
        <h5>Install the testing dependencies Jest and React Testing Library</h5>
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
        <h5 class="uui-lead">Add and publish content.</h5>
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
        <h5>Add a <code>.env</code> file to the root of your Next.js project folder.</h5>
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
        <h5>Install XPEDITE types and example components to your codebase</h5>
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
        display: block;
        text-align: center;
        border: 2px dashed var(--uui-color-border-emphasis);
        padding: var(--uui-size-space-5);
        padding-top: var(--uui-size-space-6);
        border-radius: var(--uui-size-space-2);
      }

      .welcome {
        /* background: linear-gradient(to top right, #090223 66%, #210223); */
        /* background: linear-gradient(to top right, #001a1a, #012424); */

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 1rem;
        margin-bottom: 2rem;
        /* box-shadow: var(--uui-shadow-depth-1, 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24));
        border-radius: var(--uui-border-radius, 3px); */

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

        .logo-title{
            display: flex;
            align-items: center;
            justify-content: center;

            img{
                max-height: 100px;
            }

            h2{

            }
        }

        /* h2 {
          font-size: 2rem;
          height: auto;
          line-height: normal;
        } */

        .success {
          color: #80ccb5;
          background: linear-gradient(90deg, #80ccb5, #a8cca6, #80ccb5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .info {
          color: white;
          text-align: left;
          list-style-type: none;

          li {
            h5 {
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

        .in-progress {
          /* color: #ccc480;
          background: linear-gradient(90deg, #ccc480, #ccc0a6, #ccc480);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; */
        }

        .steps {
          /* color: white; */
          text-align: left;

          li {
            padding-bottom: 40px;

            code,
            pre {
              color: #eee;
              background: #222;
              border: 1px solid rgba(255, 255, 255, 0.25);
            }

            code {
              padding: 1px 5px;
            }

            pre {
              padding: 10px;
            }

            h5 {
            }

            .help {
            }

            &.done {
              padding-bottom: 0;

              code{
                color: inherit;
              background: none;
              border: none;
              padding: 0;
              }

              h5 {
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

export default XpediteWelcome2;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-welcome2": XpediteWelcome2;
  }
}
