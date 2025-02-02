import { IController } from '../../types/controllers/controller';
import { AppStateModal, EventType } from '../../types/models/AppState';
import { IDetails } from '../../types/models/shopApi';
import { IFormView } from '../../types/views/view';
import { IEvents } from '../base/events';
import { ModalView } from './view';

export class DetailsFormModalView extends ModalView<void> implements IFormView {
	constructor(broker: IEvents, controller: IController) {
		super(broker, controller);
		this.element.setAttribute('id', 'detailsModal');
		this.render();
	}

	nextModal(): void {
		this.controller.setModal(AppStateModal.contacts);
		this.element.classList.remove('modal_active');
	}

	render(): void {
		const template = document.querySelector('#order') as HTMLTemplateElement;
		const form = template.content.cloneNode(true) as HTMLFormElement;
		const altButtons = Array.from(
			form.querySelectorAll('.button_alt')
		) as HTMLButtonElement[];
		altButtons[0].addEventListener('click', () => {
			this._altButtonHandler(altButtons, 0);
			this.checkFilled.bind(this)();
		});
		altButtons[1].addEventListener('click', () => {
			this._altButtonHandler(altButtons, 1);
			this.checkFilled.bind(this)();
		});
		form
			.querySelector('.form__input')
			.addEventListener('input', this.checkFilled.bind(this));
		const orderButton = form.querySelector(
			'.order__button'
		) as HTMLButtonElement;
		this.broker.on(
			EventType.detailsError,
			(error: { detailsError: string }) => {
				orderButton.disabled = true;
				form.querySelector('.form__errors').textContent = error.detailsError;
			}
		);
		orderButton.addEventListener('click', (e) => {
			e.preventDefault();
			const details = this._createDetails();
			this.controller.fillDetails(details);
			if (this.controller.validateDetails(details)) {
				this.nextModal();
			}
		});
		this.element.querySelector('.modal__content').appendChild(form);
	}

	checkFilled(): void {
		this.element.querySelector('.form__errors').textContent = '';
		const checkedButton = this.element.querySelector('.button_alt-active');
		const input = this.element.querySelector(
			'.form__input'
		) as HTMLInputElement;
		const orderButton = this.element.querySelector(
			'.order__button'
		) as HTMLButtonElement;
		orderButton.disabled = !(input.value !== '' && checkedButton);
	}

	private _altButtonHandler(
		buttons: HTMLButtonElement[],
		toggleElement: number
	): void {
		buttons[toggleElement].classList.toggle('button_alt-active');
		buttons[buttons.length - toggleElement - 1].classList.remove(
			'button_alt-active'
		);
	}

	private _createDetails(): IDetails {
		const paymentType = this.element
			.querySelector('.button_alt-active')
			.getAttribute('name');
		const addressInput = this.element.querySelector(
			'.form__input'
		) as HTMLInputElement;
		const address = addressInput.value;
		return {
			payment: paymentType,
			address: address,
		};
	}
}