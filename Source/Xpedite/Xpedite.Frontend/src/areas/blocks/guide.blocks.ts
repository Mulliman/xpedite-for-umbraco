import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { blocksDescription, blocksIcon } from "./info.blocks";
import { XpediteStyles } from "../../styles";

@customElement("xpedite-blocks-guide")
export class XpediteBlocksGuide extends UmbElementMixin(LitElement) {
  constructor() {
    super();
  }

  render() {
    return html`
      <div class="uui-text guide">
        <uui-icon name="icon-axis-rotation"></uui-icon>
        <h2>Let's generate a block!</h2>
        <p class="intro">Simply complete a couple of sections and your auto generated headless component will appear here.</p>

        <uui-icon name=${blocksIcon}></uui-icon>
        <h3 class="heading-below-icon">What is a block?</h3>
        <p class="uui-lead">${blocksDescription}</p>
        <p>
          For example, you may have a rich text block, an image block, a quote block etc. which content editors can add to the page in any order they want.
        </p>

        <uui-icon name="icon-wand"></uui-icon>
        <h3 class="heading-below-icon">What is auto generated?</h3>
        <p class="uui-lead">
        The React component will be created with all the Umbraco properties that you select being passed in as props. The code required to render
        these properties will be added to the render function of the component. It will also create a CSS file and a testing file that will configure a snapshot test and some example templates for some unit tests.
        </p>
        <p>
          You can then copy these files or automatically apply them to your codebase and change the order of the components, as well as adding your own markup or custom components.
        </p>

        <uui-icon name="icon-user"></uui-icon>
        <h3 class="heading-below-icon">What do I need to do?</h3>
        <p class="uui-lead">
          You will need to define a Content Type that <strong>is an element</strong> and add all the properties you need to use in your component. 
          For blocks you may also want to create a second element content type that can be used for controlling settings.
        </p>
        <p>
          <a class="x-button-tertiary" href="/umbraco/section/settings/workspace/document-type-root/table">Create a document type</a>
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
    XpediteStyles,
    css`
      uui-icon {
        margin-top: var(--uui-size-space-6);
        font-size: 1.8rem;
      }

      h3.heading-below-icon {
        margin-top: var(--uui-size-space-4);
      }
    `,
  ];
}

export default XpediteBlocksGuide;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-blocks-guide": XpediteBlocksGuide;
  }
}
