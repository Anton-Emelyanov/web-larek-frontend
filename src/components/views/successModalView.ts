import { IController } from '../../types/controllers/controller';
import { EventType } from '../../types/models/AppState';
import { IOrderResponse } from '../../types/models/shopApi';
import { createElement, priceWithUnit } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ModalView } from './view';

export class SuccessModalView extends ModalView<IOrderResponse> {
	constructor(broker: IEvents, controller: IController) {
		super(broker, controller);
		this.element.setAttribute('id', 'successModal');
		this.broker.on(EventType.successOrder, (data: IOrderResponse) =>
			this.render(data)
		);
	}

	render(data?: Partial<IOrderResponse>): void {
		this.element.querySelector('.modal__content').remove();
		const content = createElement('div');
		content.classList.add('modal__content');
		const template = document.querySelector('#success') as HTMLTemplateElement;
		const success = template.content.cloneNode(true) as HTMLElement;
		success.querySelector(
			'.order-success__description'
		).textContent = `Списано ${priceWithUnit(data.total)}`;
		success
			.querySelector('.button')
			.addEventListener('click', () => this.nextModal());
		this.element.querySelector('.modal__container').appendChild(success);
	}

	nextModal(): void {
		this.closeModal();
	}
}