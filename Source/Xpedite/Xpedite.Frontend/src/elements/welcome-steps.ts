import { css, html, customElement, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";

import "./create-button";

import { XpediteStyles } from "../styles";
import { ConfigModel, V1Service } from "../api";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { lightGreenCss, mainGreenCss, mainGreenTranslucentCss } from "../styles/colours";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";

@customElement("xpedite-welcome-steps")
export class XpediteWelcomeSteps extends UmbLitElement {
  @property({ type: Object })
  config: ConfigModel | undefined;

  readonly DONE_CLASS = "done";
  readonly IMPOSSIBLE_CLASS = "impossible";

	#notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;

  override connectedCallback(): void {
		super.connectedCallback();

		this.consumeContext(UMB_NOTIFICATION_CONTEXT, (instance) => {
			this.#notificationContext = instance;
		});
	}

	constructor() {
		super();
  }

  override render() {
    if (!this.config) {
      return;
    }

    return this.#renderInProgress(this.config);
  }

  #getStepClassName(completedCheck: boolean | null | undefined, dependencyCheck: boolean | null | undefined = true){
    if(!dependencyCheck){
      return this.IMPOSSIBLE_CLASS;
    }

    if(completedCheck) {
      return this.DONE_CLASS;
    }

    return "";
  }

  #renderInProgress(config: ConfigModel | undefined) {
    if (!config || config.isComplete) {
      return;
    }

    return html`
      <h1 class="x-text-gradient-light uui-font">You are a few steps away...</h1>
      <div>
        <ol class="steps">
          ${this.#renderDeliveryApiInstallStep(config)} ${this.#renderDeliveryApiStep(config)} ${this.#renderNextJsStep(config)}
          ${this.#renderSrcDirectoryStep(config)} ${this.#renderTestingStep(config)} ${this.#renderDotEnvStep(config)}
          ${this.#renderXpediteCodeStep(config)} ${this.#renderContentStep(config)}
        </ol>
      </div>
    `;
  }
  
  // #region Steps

  #renderDeliveryApiInstallStep(config: ConfigModel) {
    const className = this.#getStepClassName(config.isDeliveryApiInstalled);

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
    const className = this.#getStepClassName(config.isDeliveryApiEnabled);

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
    const className = this.#getStepClassName(config.isNextJsInstalled);

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
    const className = this.#getStepClassName(!!(config.codebaseSrcPath?.length));

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
    const className = this.#getStepClassName(config.isReactTestingInstalled, config.isNextJsInstalled);

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
    const className = this.#getStepClassName(config.isContentInPlace);

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
    const className = this.#getStepClassName(config.isEnvFileInstalled, config.isNextJsInstalled);

    return html`
      <li class=${className}>
        <h3>Add a <code>.env</code> file to the root of your Next.js project folder.</h3>
        <div class="help">
          <p><button class="x-button" @click=${() => this.#createDotEnv()}>Automatically add .env file</button> or add the following to an existing file:</p>
          <pre>
UMBRACO_SERVER_URL={Your URL}
UMBRACO_DELIVERY_API_KEY={Your API KEY}
UMBRACO_HOME_ITEM={Your home page}</pre
          >
        </div>
      </li>
    `;
  }

  async #createDotEnv() {
    await tryExecuteAndNotify(this, V1Service.postApiV1XpediteAddEnvFile());

    if(this.#notificationContext){
      this.#notificationContext.peek("positive", {
        data: {
          headline: "Success",
          message: ".env file created in Src folder"
        }
      });
    }

    this.dispatchEvent(new CustomEvent("stepCompleted", { detail: { step: "dotEnv" } }));
  }

  #renderXpediteCodeStep(config: ConfigModel) {
    const className = this.#getStepClassName(config.isXpediteTypescriptCodeInstalled, config.isNextJsInstalled);

    return html`
      <li class=${className}>
        <h3>Install XPEDITE types and example components to your codebase</h3>
        <div class="help">
          <button class="x-button" @click=${() => this.#addBaseCode()}>Automatically copy files to codebase</button> or copy the files you want manually from the app_plugins folder of this Umbraco
          instance.
        </div>
      </li>
    `;
  }

  async #addBaseCode() {
    await tryExecuteAndNotify(this, V1Service.postApiV1XpediteAddBaseFiles());

    if(this.#notificationContext){
      this.#notificationContext.peek("positive", {
        data: {
          headline: "Success",
          message: "Base files added to Src folder"
        }
      });
    }

    this.dispatchEvent(new CustomEvent("stepCompleted", { detail: { step: "baseCode" } }));
  }

  // #endregion

  static override styles = [
    UmbTextStyles,
    XpediteStyles,
    css`
      :host {
      }

      .steps {
        color: white;
        text-align: left;
        list-style: none;
        counter-reset: step-counter;
        padding-top: 1rem;
        max-width:1200px;

        li {
          padding: 1rem 0;
          border-top: 2px solid #AAFFEE22;
          position: relative;
          counter-increment: step-counter;

          h3 {
            &::before {
              content: counter(step-counter);
              background: ${mainGreenCss};
              color: white;
              padding:0.6rem 0.75rem 0.5rem;
              margin-right: 0.5rem;
            }
          }

          a{
            color: ${lightGreenCss};
            font-weight: bold;

            &:hover{
              color: ${mainGreenCss};
            }
          }

          .help {
          }

          &.impossible {
            h3 {
              opacity: 0.66;

              &::before {
                content: counter(step-counter) '. Pending earlier step';
                background: ${mainGreenTranslucentCss};
              }
            }

            .help {
              display: none;
            }
          }

          &.done {
            h3 {
              text-decoration: line-through;
              opacity: 0.33;

              &::before {
                content: counter(step-counter) '. Completed';
                background: ${mainGreenTranslucentCss};
                background: #000;
              }
            }

            .help {
              display: none;
            }
          }

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
        }
      }
    `,
  ];
}

export default XpediteWelcomeSteps;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-welcome-steps": XpediteWelcomeSteps;
  }
}
