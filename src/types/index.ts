export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price?: number;
}

export interface IBasket {
	total: number;
	items: IProduct[];
}

export interface IDetails {
	payment: string;
	address: string;
}

export interface IContacts {
	email: string;
	phone: string;
}

export interface IOrder extends IBasket, IContacts, IDetails {}

export interface IOrderResponse {
	id: string;
	total: number;
	error?: string;
}

export interface IShopAPI {
	getProductList(): Promise<IProduct[]>;
	getProduct(id: string): Promise<IProduct>;
	createOrder(order: IOrder): Promise<IOrderResponse>;
}

export interface IAppState {
	productList: IProduct[];
	selectedProduct?: IProduct;
	basket?: IBasket;
	basketCounter: number;
	contacts: IContacts;
	details: IDetails;
	openedModal: AppStateModals;
	loadProductList(): Promise<void>;
	createOrder(): Promise<IOrderResponse>;
	selectProduct(id: string): void;
	addProduct(id: string): void;
	removeProduct(id: string): void;
	fillContacts(contacts: Partial<IContacts>): void;
	fillDetails(details: Partial<IDetails>): void;
	openModal(modal: AppStateModals): void;
}

export interface IView<T> {
    element: HTMLElement;
    render(data?: Partial<T>): HTMLElement;
}

export enum AppStateModals {
	card = 'modal:card',
	basket = 'modal:basket',
	details = 'modal:details',
	contacts = 'modal:contacts',
	success = 'modal:success',
	none = 'modal:none',
}

export enum EventType {
	closeModal = 'event:close',
	openCard = 'event:openCard',
	openBasket = 'event:openBasket',
	nextModal = 'event:nextModal',
	addToBasket = 'event:addToBasket',
	removeFromBasket = 'event:removeFromBasket'
}
