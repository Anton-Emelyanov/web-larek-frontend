import { IController } from '../../types/controllers/controller';
import { AppStateModal, IAppState } from '../../types/models/AppState';
import {
	IBasket,
	IContacts,
	IDetails,
	IProduct,
	IShopAPI,
} from '../../types/models/shopApi';

export class Controller implements IController {
	private _state: IAppState;
	private _api: IShopAPI;

	constructor(state: IAppState, api: IShopAPI) {
		this._state = state;
		this._api = api;
		this.loadProductList();
	}

	async loadProductList(): Promise<void> {
		try {
			const productList = await this._api.getProductList();
			this._state.updateProductList(productList.items);
		} catch (error) {
			console.error('Ошибка загрузки:', error);
		}
	}

	async createOrder(): Promise<void> {
		try {
			const order = this._state.getOrder();
			const response = await this._api.createOrder(order);
			this._state.updateOrderResponse(response);
		} catch (error) {
			console.error('Ошибка загрузки:', error);
		}
	}

	selectProduct(id: string): void {
		const product = this._findProduct(id);
		this._state.updateSelectedProduct(product);
		this.setModal(AppStateModal.card);
	}

	addProduct(id: string): void {
		const product = this._findProduct(id);
		const basket = this._state.getBasket();
		const newBasket: IBasket = {
			items: [...basket.items, product],
			total: basket.total + product.price,
		};
		this._state.updateBasket(newBasket);
	}

	removeProduct(id: string): void {
		const basket = this._state.getBasket();
		const productIndex = basket.items.findIndex((p) => p.id === id);
		const newBasket: IBasket =
			productIndex > -1
				? {
						items: [
							...basket.items.slice(0, productIndex),
							...basket.items.slice(productIndex + 1),
						],

						total: basket.total - this._findProduct(id).price,
				  }
				: basket;
		this._state.updateBasket(newBasket);
	}

	fillContacts(contacts: Partial<IContacts>): void {
		if (this.validateContacts(contacts)) {
			this._state.updateContacts(contacts as IContacts);
		} else {
			this._state.updateContactsError(
				'Контактные данные заполнены не до конца'
			);
		}
	}

	fillDetails(details: Partial<IDetails>): void {
		if (this.validateDetails(details)) {
			this._state.updateDetails(details as IDetails);
		} else {
			this._state.updateDetailsError('Данные о заказе заполнены не до конца');
		}
	}

	clearBasket(): void {
		this._state.updateBasket({
			items: [],
			total: null,
		});
	}

	validateContacts(contacts: Partial<IContacts>): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex = /^\+?[1-9]\d{1,14}$/;
		return (
			emailRegex.test(contacts.email || '') &&
			phoneRegex.test(contacts.phone || '')
		);
	}

	validateDetails(details: Partial<IDetails>): boolean {
		return (
			details.payment !== undefined &&
			details.address !== undefined &&
			details.address !== ''
		);
	}

	setModal(modal: AppStateModal): void {
		if (this._state.getCurrentModal() === modal) return; // Проверяем, изменилось ли состояние
		this._state.updateOpenedModal(modal);
	}

	private _findProduct(id: string): IProduct {
		const productList = this._state.getProductList();
		return productList.find((p) => p.id === id);
	}
}
