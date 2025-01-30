import {
	IOrder,
	IOrderResponse,
	IProduct,
	IProductListResponse,
	IShopAPI,
} from '../../types/models/shopApi';
import { Api } from '../base/api';

export class ShopAPI extends Api implements IShopAPI {
	async getProductList(): Promise<IProductListResponse> {
		return this.get('/product/') as Promise<IProductListResponse>;
	}
	async getProduct(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`) as Promise<IProduct>;
	}
	async createOrder(order: IOrder): Promise<IOrderResponse> {
		const postBody = {
			...order,
			items: order.items.map((p) => p.id),
		};
		return this.post('/order', postBody) as Promise<IOrderResponse>;
	}
}