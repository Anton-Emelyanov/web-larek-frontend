import { Price } from '..';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: Price;
}

export interface IBasket {
	items: IProduct[];
	total: Price;
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
	total: Price;
}

export interface IProductListResponse {
	total: number;
	items: IProduct[];
}

export interface IShopAPI {
	getProductList(): Promise<IProductListResponse>;
	getProduct(id: string): Promise<IProduct>;
	createOrder(order: IOrder): Promise<IOrderResponse>;
}