export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	protected handleResponse(response: Response): Promise<object> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	async get(uri: string) {
		const response = await fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		});
		return this.handleResponse(response);
	}

	async post(uri: string, data: object, method: ApiPostMethods = 'POST') {
		const response = await fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		});
		return this.handleResponse(response);
	}
}
