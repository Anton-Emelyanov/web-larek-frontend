import { IController } from '../../types/controllers/controller';
import { AppStateModal } from '../../types/models/AppState';
import { IProduct } from '../../types/models/shopApi';
import { CDN_URL } from '../../utils/constants';
import { priceWithUnit, setCategory } from '../../utils/utils';
import { IEvents } from '../base/events';
import { View } from './view';

export class ProductView extends View<IProduct> {
	private readonly _isCompact: boolean;

	constructor(broker: IEvents, controller: IController, isCompact: boolean) {
		super(broker, controller);
		this._isCompact = isCompact;

		const template = document.querySelector(
			this._isCompact ? '#card-basket' : '#card-catalog'
		) as HTMLTemplateElement;
		this.element = template.content.cloneNode(true) as HTMLElement;
	}

	render(data?: Partial<IProduct & { index: number }>): void {
		this.element.querySelector('.card__title').textContent = data.title;
		this.element.querySelector('.card__price').textContent = priceWithUnit(
			data.price
		);
		if (this._isCompact) {
			this.element.querySelector('.basket__item-index').textContent =
				data.index.toString();
			this.element
				.querySelector('.basket__item-delete')
				.addEventListener('click', () =>
					this.controller.removeProduct(data.id)
				);
		} else {
			this.element
				.querySelector('.gallery__item')
				.addEventListener('click', () => {
					this.controller.selectProduct(data.id);
					this.controller.setModal(AppStateModal.card);
				});
			setCategory(this.element.querySelector('.card__category'), data.category);
			const image = this.element.querySelector(
				'.card__image'
			) as HTMLImageElement;
			image.src = CDN_URL + data.image;
		}
	}
}