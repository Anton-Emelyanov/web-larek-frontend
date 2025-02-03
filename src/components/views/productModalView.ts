import { IController } from '../../types/controllers/controller';
import { EventType, AppStateModal } from '../../types/models/AppState';
import { IProduct, IBasket } from '../../types/models/shopApi';
import { CDN_URL } from '../../utils/constants';
import { createElement, setCategory, priceWithUnit } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ModalView } from './view';

export class ProductModalView extends ModalView<IProduct> {
	private _inBasket: boolean;

	constructor(broker: IEvents, controller: IController) {
		super(broker, controller);
		this._inBasket = false;
		this.broker.on(
			EventType.openCard,
			(data: { product: IProduct; inBasket: boolean }) => {
				this._inBasket = data.inBasket;
				this.render(data.product);
				this.openModal();
			}
		);
	}

	nextModal(): void {
		this.controller.setModal(AppStateModal.basket);
		this.element.classList.remove('modal_active');
	}
	render(data?: Partial<IProduct>): void {
		this.element.querySelector('.modal__content').remove();
		const content = createElement('div');
		content.classList.add('modal__content');
		const card = document
			.querySelector('.card_full')
			.cloneNode(true) as HTMLElement;
		const image = card.querySelector('.card__image') as HTMLImageElement;
		image.src = CDN_URL + data.image;
		setCategory(card.querySelector('.card__category'), data.category);
		card.querySelector('.card__title').textContent = data.title;
		card.querySelector('.card__text').textContent = data.description;
		card.querySelector('.card__price').textContent = priceWithUnit(data.price);
		const button = card.querySelector('.button') as HTMLButtonElement;
		const addButtonHandler = () => this.controller.addProduct(data.id);
		const nextModalHandler = () => this.nextModal();
		this.broker.on(EventType.updateBasket, (b: { basket: IBasket }) => {
			this._inBasket =
				b.basket.items.findIndex((item) => item.id === data.id) > -1;

			this._renderButton(button, addButtonHandler, nextModalHandler);
		});
		this._renderButton(button, addButtonHandler, nextModalHandler);
		content.appendChild(card);
		this.element.querySelector('.modal__container').appendChild(content);
	}

	private _renderButton(
    button: HTMLButtonElement,
    addButtonHandler: () => void,
    nextModalHandler: () => void
	): void {
			if (this._inBasket) {
					button.textContent = 'В корзину';
					button.removeEventListener('click', addButtonHandler);
					button.addEventListener('click', nextModalHandler);
					button.disabled = false;
			} else if (button.closest('.card').querySelector('.card__price')?.textContent === 'Бесценно') {
					button.textContent = 'Купить';
					button.disabled = true;
			} else {
					button.textContent = 'Купить';
					button.removeEventListener('click', nextModalHandler);
					button.addEventListener('click', addButtonHandler);
					button.disabled = false;
			}
	}

}