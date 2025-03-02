import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { XpediteStyles } from "../../styles";
import { templatesDescription } from "./info.templates";

@customElement("xpedite-templates-guide")
export class XpediteTemplatesGuide extends UmbElementMixin(LitElement) {
  constructor() {
    super();
  }

  render() {
    return html`
      <div class="uui-text x-guide">
        
        <uui-icon name="icon-axis-rotation"></uui-icon>
        <h2>Let's generate a page template!</h2>
        <p class="intro">Simply complete a couple of sections and your auto generated headless component will appear here.</p>

        <uui-icon name="icon-document-dashed-line"></uui-icon>
        <h3 class="heading-below-icon">What is a page template?</h3>
        <p class="uui-lead">
          ${templatesDescription}
        </p>
        <p>
          For example, a template may render a header, a title, a block list, and finally a footer and will define the markup that surrounds these.
        </p>

        <uui-icon name="icon-wand" class="uui-margin-top-3"></uui-icon>
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
          You will need to define a Document Type that is <strong>NOT</strong> marked as an element type and add all the properties you need to use in
          your component. 
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
      
    `,
  ];
}

export default XpediteTemplatesGuide;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-templates-guide": XpediteTemplatesGuide;
  }
}
