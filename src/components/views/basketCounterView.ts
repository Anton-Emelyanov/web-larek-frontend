import { IController } from '../../types/controllers/controller';
import { EventType, AppStateModal } from '../../types/models/AppState';
import { IEvents } from '../base/events';
import { View } from './view';

export class BasketCounterView extends View<{ counter: number }> {
	private basketElement: HTMLElement;
	private counterElement: HTMLElement;

	constructor(broker: IEvents, controller: IController) {
		super(broker, controller);

		this.basketElement = document.querySelector('.header__basket') as HTMLElement;
		this.counterElement = this.basketElement.querySelector('.header__basket-counter') as HTMLElement;

		this.broker.on(EventType.updateBasket, (data: { counter: number }) =>
			this.render(data)
		);
		this.basketElement.addEventListener('click', () =>
			this.controller.setModal(AppStateModal.basket)
		);
	}

	render(data?: { counter: number }): void {
		if (data) {
			this.counterElement.textContent = data.counter.toString();
		}
	}
}
