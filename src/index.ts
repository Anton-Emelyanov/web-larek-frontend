import './scss/styles.scss';
import { ShopAPI } from './components/api/shopApi';
import { EventEmitter } from './components/base/events';
import { Controller } from './components/controllers/controller';
import { AppState } from './components/models/appState';
import { BasketCounterView } from './components/views/basketCounterView';
import { BasketModalView } from './components/views/basketModalView';
import { ContactsFormModalView } from './components/views/contactsFormModalView';
import { DetailsFormModalView } from './components/views/detailsFormModalView';
import { ProductListView } from './components/views/productListView';
import { ProductModalView } from './components/views/productModalView';
import { SuccessModalView } from './components/views/successModalView';
import { AppStateModal, EventType } from './types/models/AppState';
import { API_URL } from './utils/constants';

const broker = new EventEmitter();
const api = new ShopAPI(API_URL);
const state = new AppState(broker);
const controller = new Controller(state, api);

const mainProductList = new ProductListView(broker, controller, false);
const basketCounter = new BasketCounterView(broker, controller);
const productView = new ProductModalView(broker, controller);
const basketView = new BasketModalView(broker, controller);
const detailsView = new DetailsFormModalView(broker, controller);
const contactsView = new ContactsFormModalView(broker, controller);
const successView = new SuccessModalView(broker, controller);

function nextModalSwitcher(modal: AppStateModal) {
	const detailsModal = document.getElementById('detailsModal');
	const contactsModal = document.getElementById('contactsModal');
	const successModal = document.getElementById('successModal');
	if (modal === AppStateModal.details) {
		detailsModal.classList.add('modal_active');
	} else if (modal === AppStateModal.contacts) {
		contactsModal.classList.add('modal_active');
	} else if (modal === AppStateModal.success) {
		successModal.classList.add('modal_active');
	}
}

broker.on(EventType.nextModal, (data: { modal: AppStateModal }) =>
	nextModalSwitcher(data.modal)
);