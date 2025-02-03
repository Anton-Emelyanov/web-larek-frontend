import {
	AppStateModal,
	EventType,
	IAppState,
} from '../../types/models/AppState';
import {
	IProduct,
	IBasket,
	IContacts,
	IDetails,
	IOrder,
	IOrderResponse,
} from '../../types/models/shopApi';
import { IEvents } from '../base/events';

export class AppState implements IAppState {
	private _broker: IEvents;
	private _productList: IProduct[];
	private _selectedProduct?: IProduct;
	private _basket: IBasket;
	private _contacts: IContacts;
	private _details: IDetails;
	private _openedModal: AppStateModal;
	private _contactsError?: string;
	private _detailsError?: string;
	private _orderResponse?: IOrderResponse;

	constructor(broker: IEvents) {
		this._broker = broker;
		this._productList = [];
		this._selectedProduct = undefined;
		this._basket = {
			items: [],
			total: null,
		};
		this._contacts = {
			email: '',
			phone: '',
		};
		this._details = {
			payment: undefined,
			address: '',
		};
		this._openedModal = AppStateModal.none;
		this._contactsError = undefined;
		this._detailsError = undefined;
	}

	updateProductList(productList: IProduct[]): void {
		this._productList = productList;
		this._broker.emit(EventType.getProductList, this._productList);
	}

	updateSelectedProduct(selectedProduct: IProduct): void {
		this._selectedProduct = selectedProduct;
		this._broker.emit(EventType.openCard, {
			product: this._selectedProduct,
			inBasket:
				this.getBasket().items.findIndex(
					(item) => item.id === this._selectedProduct.id
				) > -1,
		});
	}

	updateBasket(basket: IBasket): void {
		this._basket = basket;
		this._broker.emit(EventType.updateBasket, {
			basket: this._basket,
			counter: this.getBasketCounter(),
		});
	}

	updateContacts(contacts: IContacts): void {
		this._contacts = contacts;
		this._broker.emit(EventType.nextModal, this._contacts);
	}

	updateDetails(details: IDetails): void {
		this._details = details;
		this._broker.emit(EventType.nextModal, this._details);
	}

	updateOpenedModal(modal: AppStateModal): void {
		this._openedModal = modal;
		const event =
			modal === AppStateModal.basket
				? EventType.openBasket
				: modal === AppStateModal.none
				? EventType.closeModal
				: EventType.nextModal;
		this._broker.emit(event, { modal: this._openedModal });
	}

	updateContactsError(contactError: string): void {
		this._contactsError = contactError;
		this._broker.emit(EventType.contactsError, {
			contactError: this._contactsError,
		});
	}

	updateDetailsError(detailsError: string): void {
		this._detailsError = detailsError;
		this._broker.emit(EventType.detailsError, {
			detailsError: this._detailsError,
		});
	}

	updateOrderResponse(orderResponse: IOrderResponse): void {
		this._orderResponse = orderResponse;
		this._broker.emit(EventType.successOrder, this._orderResponse);
	}

	getBasketCounter(): number {
		return this._basket.items.length;
	}

	getOrder(): IOrder {
		return {
			...this._basket,
			...this._details,
			...this._contacts,
		};
	}

	getProductList(): IProduct[] {
		return this._productList;
	}

	getBasket(): IBasket {
		return this._basket;
	}

	getCurrentModal(): AppStateModal {
		return this._openedModal;
	}

}