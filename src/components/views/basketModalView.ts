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
        this.broker.on(EventType.openBasket, () => this.openModal());
        this.broker.on(EventType.updateBasket, (data: { basket: IBasket }) => {
            this.render(data.basket);
        });
    }

    nextModal(): void {
        this.controller.setModal(AppStateModal.details);
    }

    render(data?: Partial<IBasket>): void {
        const listView = new ProductListView(this.broker, this.controller, true);
        this.element.querySelector('.modal__content')?.remove();
        const content = createElement('div');
        content.classList.add('modal__content');
        const template = document.querySelector('#basket') as HTMLTemplateElement;
        const basket = template.content.cloneNode(true) as HTMLElement;

        listView.render(data ? data.items : []);
        basket.querySelector('.modal__title')?.append(listView.element);

        const orderButton = basket.querySelector('.button') as HTMLButtonElement;
        if (!data || !data.items || data.items.length === 0) {
            orderButton.setAttribute('disabled', 'true');
        } else {
            orderButton.removeAttribute('disabled');
        }
        orderButton.addEventListener('click', () => this.nextModal());

        basket.querySelector('.basket__price')!.textContent = data
            ? data.total
                ? priceWithUnit(data.total)
                : '0 синапсов'
            : '0 синапсов';

        content.appendChild(basket);
        this.element.querySelector('.modal__container')!.appendChild(content);
    }
}