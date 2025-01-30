export interface IView<T> {
	render(data?: Partial<T>): void;
}

export interface IModalView {
	nextModal(): void;
	closeModal(): void;
}

export interface IFormView {
	checkFilled(): void;
}