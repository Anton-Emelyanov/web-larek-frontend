import { IController } from '../../types/controllers/controller';
import { AppStateModal, EventType } from '../../types/models/AppState';
import { IModalView, IView } from '../../types/views/view';
import { IEvents } from '../base/events';

export abstract class View<T> implements IView<T> {
	element: HTMLElement;
	protected broker: IEvents;
	protected controller: IController;

	protected constructor(broker: IEvents, controller: IController) {
		this.broker = broker;
		this.controller = controller;
	}
	abstract render(data?: Partial<T>): void;
}

export abstract class ModalView<T> extends View<T> implements IModalView {
	protected constructor(broker: IEvents, controller: IController) {
		super(broker, controller);
		this.element = document
			.querySelector('#modal-container')
			.cloneNode(true) as HTMLElement;
		this.element
			.querySelector('.modal__close')
			.addEventListener('click', () => this.closeModal());
		this.element.addEventListener('click', (e) => {
			if (e.target === this.element) {
				this.closeModal();
			}
		});
		this.broker.on(EventType.closeModal, () =>
			this.element.classList.remove('modal_active')
		);
		document.querySelector('.page').appendChild(this.element);
	}
	abstract nextModal(): void;
	closeModal(): void {
		this.controller.setModal(AppStateModal.none);
		document
			.querySelector('.page__wrapper')
			.classList.remove('page__wrapper_locked');
	}
}