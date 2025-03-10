import { IController } from '../../types/controllers/controller';
import { EventType, AppStateModal } from '../../types/models/AppState';
import { IContacts } from '../../types/models/shopApi';
import { IFormView } from '../../types/views/view';
import { IEvents } from '../base/events';
import { ModalView } from './view';

export class ContactsFormModalView
	extends ModalView<void>
	implements IFormView
{
	constructor(broker: IEvents, controller: IController) {
		super(broker, controller);
		this.render();
		this.element.setAttribute('id', 'contactsModal');
	}

	render(): void {
		const template = document.querySelector('#contacts') as HTMLTemplateElement;
		const form = template.content.cloneNode(true) as HTMLFormElement;
		const inputs = Array.from(
			form.querySelectorAll('.form__input')
		) as HTMLInputElement[];
		inputs.forEach((input) =>
			input.addEventListener('input', this.checkFilled.bind(this))
		);

		const orderButton = form.querySelector('.button') as HTMLButtonElement;
		this.broker.on(
			EventType.detailsError,
			(error: { detailsError: string }) => {
				orderButton.disabled = true;
				form.querySelector('.form__errors').textContent = error.detailsError;
			}
		);

		this.broker.on(EventType.contactsError, (error: { contactError: string }) => {
			orderButton.disabled = true;
			const errorElement = this.element.querySelector('.form__errors');
			if (errorElement) {
					errorElement.textContent = error.contactError;
			}
		});


		orderButton.addEventListener('click', (e) => {
			e.preventDefault();
			const contacts = this._createContacts();

			if (!this.controller.validateContacts(contacts)) {
					this.controller.fillContacts(contacts);
					return;
			}

			this.controller.fillContacts(contacts);
			this.controller.createOrder();
			this.controller.clearBasket();
			this.nextModal();
		});


		this.element.querySelector('.modal__content').appendChild(form);
	}

	nextModal(): void {
		this.controller.setModal(AppStateModal.success);
		this.element.classList.remove('modal_active');
	}

	checkFilled(): void {
		const errorElement = this.element.querySelector('.form__errors');
		if (errorElement) {
				errorElement.textContent = 'Введите корректные данные';
		}

    const inputs = Array.from(
        this.element.querySelectorAll('.form__input')
    ) as HTMLInputElement[];
    const orderButton = this.element.querySelector('.button') as HTMLButtonElement;
    orderButton.disabled = !inputs.every((input) => input.value.trim() !== '');
	}


	private _createContacts(): IContacts {
		const inputs = Array.from(
			this.element.querySelectorAll('.form__input')
		) as HTMLInputElement[];
		const data = inputs.map((input) => input.value);
		return {
			email: data[0],
			phone: data[1],
		};
	}
}