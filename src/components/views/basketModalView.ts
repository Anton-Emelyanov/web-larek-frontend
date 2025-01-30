import { IController } from '../../types/controllers/controller';
import { EventType, AppStateModal } from '../../types/models/AppState';
import { IBasket } from '../../types/models/shopApi';
import { createElement, priceWithUnit } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ProductListView } from './productListView';
import { ModalView } from './view';

export class BasketModalView extends ModalView<IBasket> {
	constructor(broker: IEvents, controller: IController) {
		super(broker, controller);
		this.render();
		this.broker.on(EventType.openBasket, () => {
			this.element.classList.add('modal_active');
			document
				.querySelector('.page__wrapper')
				.classList.add('page__wrapper_locked');
		});
		this.broker.on(EventType.updateBasket, (data: { basket: IBasket }) => {
			this.render(data.basket);
		});
	}

	nextModal(): void {
		this.controller.setModal(AppStateModal.details);
		this.element.classList.remove('modal_active');
	}
	render(data?: Partial<IBasket>): void {
		const listView = new ProductListView(this.broker, this.controller, true);
		this.element.querySelector('.modal__content').remove();
		const content = createElement('div');
		content.classList.add('modal__content');
		const template = document.querySelector('#basket') as HTMLTemplateElement;
		const basket = template.content.cloneNode(true) as HTMLElement;
		listView.render(data ? data.items : []);
		basket.querySelector('.modal__title').append(listView.element);
		basket
			.querySelector('.button')
			.addEventListener('click', () => this.nextModal());
		basket.querySelector('.basket__price').textContent = data
			? data.total
				? priceWithUnit(data.total)
				: '0 синапсов'
			: '0 синапсов';
		content.appendChild(basket);
		this.element.querySelector('.modal__container').appendChild(content);
	}
}