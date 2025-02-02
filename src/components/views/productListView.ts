import { IController } from '../../types/controllers/controller';
import { EventType } from '../../types/models/AppState';
import { IProduct } from '../../types/models/shopApi';
import { createElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ProductView } from './productView';
import { View } from './view';

export class ProductListView extends View<IProduct[]> {
	private readonly _isCompact: boolean;

	constructor(broker: IEvents, controller: IController, isCompact: boolean) {
		super(broker, controller);
		this._isCompact = isCompact;

		if (this._isCompact) {
			this.element = createElement('ul');
			this.element.classList.add('basket__list');
		} else {
			this.element = document.querySelector('.gallery') as HTMLElement;
			this.broker.on(EventType.getProductList, (data: IProduct[]) =>
				this.render(data)
			);
		}
	}

	render(data?: IProduct[]): void {
		const newData = this._isCompact
			? data.map((el, i) => ({ ...el, index: i + 1 }))
			: data;
		newData.forEach((elem) => {
			const productView = new ProductView(
				this.broker,
				this.controller,
				this._isCompact
			);
			productView.render(elem);
			this.element.appendChild(productView.element);
		});
	}
}