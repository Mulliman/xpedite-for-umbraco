import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { partialsDescription, partialsIcon } from "./info.partials";

@customElement("xpedite-partials-guide")
export class XpeditePartialsGuide extends UmbElementMixin(LitElement) {
  constructor() {
    super();
  }

  render() {
    return html`
      <div class="uui-text">
        <h2>Let's generate a partial!</h2>

        <p>Simply complete a couple of sections and your auto generated headless component will appear here.</p>

        <uui-icon name=${partialsIcon}></uui-icon>
        <h3 class="heading-below-icon">What is a partial?</h3>

        <p class="uui-lead">
          ${partialsDescription}
        </p>

        <p>
          For example, a template may render a header, a title, a block list, and finally a footer and will define the markup that surrounds these.
        </p>

        <uui-icon name="icon-wand"></uui-icon>
        <h3 class="heading-below-icon">What is auto generated?</h3>

        <p class="uui-lead">
          The React component will be created with all the Umbraco properties that you select being passed in as props. The code required to render
          these properties will be added to the render function of the component.
        </p>
        <p>
          You can then copy this file to your codebase and change the order of the components, as well as adding your own markup or custom components.
        </p>

        <uui-icon name="icon-user"></uui-icon>
        <h3 class="heading-below-icon">What do I need to do?</h3>
        <p class="uui-lead">
          You will need to define a Document Type that is <strong>NOT</strong> marked as an element type and add all the properties you need to use in
          your component.
        </p>
        <p>
          Don't worry if the Document Type has more properties than you need, you can choose which ones you want to pass to the auto generated
          component.
        </p>
      </div>
    `;
  }

  static styles = [
    UmbTextStyles,
    css`
      uui-icon {
        font-size: 1.8rem;
      }

      h3.heading-below-icon {
        margin-top: var(--uui-size-space-4);
      }
    `,
  ];
}

export default XpeditePartialsGuide;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-partials-guide": XpeditePartialsGuide;
  }
}
