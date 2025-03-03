import { css, html, customElement, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { XpediteStyles } from "../styles";
import { CheckResult } from "../api";

@customElement("xpedite-assistant")
export class XpediteAssistant extends UmbLitElement {
  @property({ type: String })
  public title: string = "Assistant";

  @property({ type: Array })
  public checks: CheckResult[] | undefined;

  constructor() {
    super();
  }

  override render() {
    return html`
      <div class="secondary-container">
        <div class="heading">
          <h2 class="x-text-gradient-light uui-font">${this.title}</h2>
          <uui-icon name="icon-wand"></uui-icon>
        </div>
        <div class="content">${this.#renderSmartActions()}</div>
      </div>
    `;
  }

  #renderSmartActions() {
    if (typeof this.checks === "undefined") {
      return html`<p>Select a document type for more options</p>`;
    }

    if (!this.checks.length) {
      return html`<p>No suggestions at this time</p>`;
    }

    const actions = this.checks.map((c) => this.#createAction(c));

    return html`<div class="x-actions">${actions}</div>`;
  }

  #createAction(action: CheckResult) {
    const iconName = action?.isOk ? "icon-check" : "icon-alert";
    const icon = html`<uui-icon name=${iconName}></uui-icon>`;
    const text = html`<span>${action?.message}</span>`;
    const buttonOrLink = this.#createButtonOrLink(action);

    return html`<div>${icon}${text}${buttonOrLink}</div>`;
  }

  #createButtonOrLink(action: CheckResult) {
    if (!action || !action?.actionButtonText) {
      return null;
    }

    if (action.actionUrl) {
      return html`<a href=${action.actionUrl} target="_blank" class="x-button-tertiary">${action.actionButtonText}</a>`;
    }

    if (action.actionName) {
      return html`<button @click=${() => this.#handleAction(action.actionName!)} class="x-button-secondary">${action.actionButtonText}</button>`;
    }

    return null;
  }

  async #handleAction(actionName: string) {
    this.dispatchEvent(
      new CustomEvent("runAction", {
        detail: actionName,
        bubbles: true,
        composed: true,
      })
    );
    // if (this.#assistantContext) {
    //   await this.#assistantContext.runAction(actionName);

    //   if (this.#notificationContext) {
    //     this.#notificationContext.peek("positive", {
    //       data: {
    //         headline: "Success",
    //         message: "Action completed",
    //       },
    //     });
    //   }
    // }
  }

  static override styles = [UmbTextStyles, XpediteStyles, css``];
}

export default XpediteAssistant;

declare global {
  interface HTMLElementTagNameMap {
    "xpedite-assistant": XpediteAssistant;
  }
}
