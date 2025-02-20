import type { UmbPropertyTypeModel } from '@umbraco-cms/backoffice/content-type';
import { UmbDocumentTypeDetailRepository } from '@umbraco-cms/backoffice/document-type';
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import {
	css,
	html,
	customElement,
	property,
	state,
	repeat,
	nothing,
} from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import {Task} from '@lit/task';

type PropertyTypeModel = Partial<UmbPropertyTypeModel> & { isInherited: boolean };

@customElement('xpedite-field-picker')
export class XpediteFieldPicker extends UmbLitElement {

	private _value: Array<string> = [];

	@property({ type: Array })
	public set value(val: Array<string>) {
		const oldVal = this._value;
		this._value = val;
		this.requestUpdate('value', oldVal);
		this.dispatchEvent(new UmbChangeEvent());
	}
	public get value(): Array<string> {
		return this._value;
	}

    @property({ type: String })
    public documentTypeId: string | undefined;

	#documentTypeDetailRepository = new UmbDocumentTypeDetailRepository(this);

	@state()
	private _customFields: Array<PropertyTypeModel> = [];

	constructor() {
		super();
	}

    _initTask = new Task(this, {
        args: () => [this.documentTypeId] as const,
        task: async ([documentTypeId]) => {
            if (!documentTypeId) return;

            const { data } = await this.#documentTypeDetailRepository.requestByUnique(documentTypeId);
            if (!data) return;

			this._customFields = data.properties.map((x) => ({ ...x, isInherited: false }));
    
			if(data.compositions?.length){
				const compositionRequests = data.compositions.map((composition) => 
					this.#documentTypeDetailRepository.requestByUnique(composition.contentType.unique)
				);
				const compositionResults = await Promise.all(compositionRequests);
				const compositionProperties = compositionResults
					.filter(result => result && result.data)
					.flatMap(result => result?.data?.properties ?? [])
					.map((x) => ({ ...x, isInherited: true }));

				this._customFields = [...this._customFields, ...compositionProperties];
			}

            this.value = data.properties.map((x) => x.alias);
        }
      });

    #onSelectionAdd(unique: string) {
		this.value = [...this._value, unique];
	}

	#onSelectionRemove(unique: string) {
		this.value = this._value.filter((s) => s !== unique);
	}

	override render() {
		return this._initTask.render({complete: () => html`
			${this.#renderFieldsList(this._customFields)}
		`});
	}

    #renderFieldsList(fields: Array<PropertyTypeModel>) {
		return repeat(
			fields,
			(field) => field.alias,
			(field) => {
                const alias = field?.alias;
                if (!alias) return nothing;

                const isSelected = this._value.find((x) => x === alias);
                const icon = isSelected ? 'check' : 'wrong';

				const label = field.isInherited ? `${alias} (inherited)` : alias;

                return html`<uui-menu-item
                    label=${label}
                    selectable
                    @selected=${() => this.#onSelectionAdd(alias)}
                    @deselected=${() => this.#onSelectionRemove(alias)}
                    ?selected=${isSelected}>
                    <umb-icon name=${icon} slot="icon"></umb-icon>
                </uui-menu-item>`
            }
				
		);
	}

	static override styles = [
		css`

		`,
	];
}

export default XpediteFieldPicker;

declare global {
	interface HTMLElementTagNameMap {
		'xpedite-field-picker': XpediteFieldPicker;
	}
}
