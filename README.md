# Проектная работа "Веб-ларек"

Ссылка на GitHub ``` https://github.com/Anton-Emelyanov/web-larek-frontend.git ```

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Описание проекта
В проекте реализуется MVC (Model-View-Controller) архитектура с применением паттерна проектирования "Наблюдатель" (Observer). 
С помощью брокера событий обеспечивается связь между моделью и представлением. Это архитектурный паттерн, 
используемый для разделения приложения на три ключевые компоненты, что улучшает структуру и поддерживаемость кода.

## Описание данных

### Интерфейс IProduct

Описывает ответ сервера, содержащий данные о товаре:

- id: string — уникальный идентификатор товара
- description: string — описание товара
- image: string — путь до изображения товара
- title: string — название товара
- category: string — название категории товара
- price: number | null — цена товара

### Интерфейс IBasket

Описывает содержание корзины:

- items: IProduct[] — товары, добавленные в корзину
- total: number | null — стоимость всех товаров, добавленных в корзину

### Интерфейс IDetails

Описывает информацию о заказе:

- payment: string — способ оплаты
- address: string — адрес доставки

### Интерфейс IContacts

Описывает информацию контакты пользователя:

- email: string — электронная почта
- phone: string — номер телефона

### Интерфейс IOrder

Собирает информацию из IBasket, IDetails и IContacts для отправки запроса серверу:

### Интерфейс IOrderResponse

Описывает ответ сервера с данными о заказе:

- id: string — уникальный идентификатор заказа
- total: number | null — стоимость заказа

### Интерфейс IProductListResponse

Описывает ответ сервера с данными о списке товаров:

- total: number — общее количество товаров
- items: IProduct[] — список товаров

### Интерфейс IShopAPI

Описывает взаимодействие с API:

- getProductList(): Promise<IProductListResponse> — получение списка продуктов
- getProduct(id: string): Promise<IProduct> — получение продукта по идентификатору
- createOrder(order: Order): Promise<IOrderResponse> — отправка заказа на сервер


## Модели данных
### Класс AppState:

Обрабатывает текущее состояние приложения, реализует Интерфейс IAppState. 

Конструктор: 
Конструктор принимает объект типа IEvents для отправки изменений в брокер событий.
```
interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```

Поля:

Поля в классе приватные для ограничения доступа к внутреннему состоянию модели.

- ```private _broker: IEvents``` — брокер событий
- ```private _productList: IProduct[]``` — список товаров, пришедший из API
- ```private _selectedProduct?: IProduct``` — карточка товара, выбранная пользователем
- ```private _basket: IBasket``` — корзина товаров
- ```private _contacts: IContacts``` — контакты пользователя
- ```private _details: IDetails ``` — детали заказа
- ```private _openedModal: AppStateModal``` — открытое модальное окно
- ```private _contactsError?: string``` — текст ошибки ввода контактных данных
- ```private _detailsError?: string``` — текст ошибки ввода деталей заказа
- ```private _orderResponse?: IOrderResponse``` — ответ сервера о заказе

Методы:

Методы, начинающиеся с update помимо обновления поля отправляют событие о том, что поле было изменено. Список событий указан ниже.

- ```updateProductList(productList: IProduct[]): void```
- ```updateSelectedProduct(selectedProduct: IProduct): void```
- ```updateBasket(basket: IBasket): void```
- ```updateContacts(contacts: IContacts): void```
- ```updateDetails(details: IDetails): void```
- ```updateOpenedModal(modal: AppStateModal): void```
- ```updateContactsError(contactError: string): void```
- ```updateDetailsError(detailsError: string): void```
- ```updateOrderResponse(orderResponse: IOrderResponse): void```
- ```getBasketCounter(): number``` — возвращает количество товаров в корзине
- ```getOrder(): IOrder``` — возвращает данные о заказе
- ```getProductList(): IProduct[]``` — возвращает загруженный список товаров
- ```getBasket(): IBasket``` — возвращает корзину

## Контролер
### Класс Controller:

Используется для обработки данных приходящих из представления и взаимодействия с моделью. 

Конструктор:
Конструктор принимает объект типа IAppState и объект типа IShopAPI. 
Также конструктор вызывает loadProductList() для создания первичного состояния приложения (списка товаров).

```
interface IAppState {
	updateProductList(productList: IProduct[]): void;
	updateSelectedProduct(selectedProduct: IProduct): void;
	updateBasket(basket: IBasket): void;
	updateContacts(contacts: IContacts): void;
	updateDetails(details: IDetails): void;
	updateOpenedModal(modal: AppStateModal): void;
	updateContactsError(contactError: string): void;
	updateDetailsError(detailsError: string): void;
	updateOrderResponse(orderResponse: IOrderResponse): void;
	getBasketCounter(): number;
	getOrder(): IOrder;
	getProductList(): IProduct[];
	getBasket(): IBasket;
}
```
```
interface IShopAPI {
	getProductList(): Promise<IProductListResponse>;
	getProduct(id: string): Promise<IProduct>;
	createOrder(order: IOrder): Promise<IOrderResponse>;
}
```

Поля:

- ```private _state: IAppState``` — состояние приложения
- ```private _api: IShopAPI``` — объект для взаимодействия с API

Методы:

- ```loadProductList(): Promise<void>``` — загружает список товаров и обновляет модель
- ```createOrder(): Promise<void>``` — создает заказ через API
- ```selectProduct(id: string): void``` — устанавливает в модели выбранную карточку
- ```addProduct(id: string): void``` — добавляет товар в корзину модели
- ```removeProduct(id: string): void``` — удаляет товар из корзины модели
- ```fillContacts(contacts: Partial<IContacts>): void``` — заполняет контакты в модели данными из представления
- ```fillDetails(details: Partial<IDetails>): void``` — заполняет детали заказа в модели данными из представления
- ```clearBasket(): void``` — очищает корзину в модели
- ```validateContacts(contacts: Partial<IContacts>):boolean``` — валидирует контактные данные пришедшие из представления
- ```validateDetails(details: Partial<IDetails>):boolean``` — валидирует данные о заказе пришедшие из представления
- ```setModal(modal: AppStateModal): void``` — устанавливает активное модельное окно в модели
- ```private _findProduct(id: string): IProduct``` — метод реализации для поиска конкретного товара в массиве товаров

## API
### Класс ShopAPI:

Используется для взаимодействия с API сервера. Расширяет класс Api и реализует интерфейс IShopAPI. 

Конструктор:
Конструктор, как и у родителя, принимает два аргумента: baseUrl: string и options: RequestInit.

Поля:

- ```readonly baseUrl: string``` — базовый URL сервера
- ```protected options: RequestInit ``` — набор опций, использующийся для конфигурирования fetch-запроса

Методы:

- ```getProductList(): Promise<IProduct[]>``` — получает список товаров из API
- ```getProduct(id: string): Promise<IProduct>``` — получает данные о товаре из API по id
- ```createOrder(order: IOrder): Promise<IOrderResponse>``` — отправляет данные о заказе на сервер

## Представление

### Класс View<T>:

Абстрактный класс реализующий интерфейс IView<T>. 

Конструктор:
В конструкторе принимает объект типа IEvents и IController. Это общий класс от которого наследуются все представления.

```
interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```
```
interface IController {
	loadProductList(): Promise<void>;
	createOrder(): Promise<void>;

	selectProduct(id: string): void;
	addProduct(id: string): void;
	removeProduct(id: string): void;
	fillContacts(contacts: Partial<IContacts>): void;
	fillDetails(details: Partial<IDetails>): void;
	clearBasket(): void;
	validateContacts(contacts: Partial<IContacts>): boolean;
	validateDetails(details: Partial<IDetails>): boolean;

	setModal(modal: AppStateModal): void;
}
```

Поля:

- ```element: HTMLElement``` — элемент, которым манипулирует представление
- ```protected broker: IEvents``` — брокер событий
- ```protected controller: IController``` — контроллер

Методы:

- ```abstract render(data?: Partial<T>): void``` — отображает данные в элементе

### Класс ModalView<T>:

Абстрактный класс наследующий View<T> и реализующий интерфейс IModalView. 

Конструткор:
Конструктор и поля аналогичны родительскому View<T>. Общий класс, от которого наследуются все модальные окна.

Методы:

- ```abstract nextModal(): void``` — переключает на следующее модальное окно
- ```closeModal(): void``` — закрывает активное модальное окно

### Класс ProductListView:

Класс, наследующий View<IProduct[]>. Класс отвечает за отображение списка товаров.

Конструктор:
Конструктор помимо родительских принимает поле isCompact: boolean.

Поля:

- ```_isCompact: boolean``` — флаг переключающее компактное и полное отображение карточек товара

Методы:
- ```render(data?: IProduct[]): void``` - Отвечает за отображение списка товаров

### Класс ProductView:

Класс, наследующий View<IProduct>. Класс отвечает за отображение карточки товара.

Конструктор:
Конструктор помимо родительских принимает поле isCompact: boolean.

Поля:

- ```_isCompact: boolean``` — флаг переключающее компактное и полное отображение карточки товара

Методы:
- ```render(data?: Partial<IProduct & { index: number }>): void``` - Отвечает за отображение карточки товара

### Класс BasketCounterView:

Класс, наследующий View<{ counter: number }. Отвечает за отображение счетчика товаров в корзине.

Конструктор:
В конструкторе принимает объект типа IEvents и IController. Описание в родительском классе.

Методы:
- ```render(data?: { counter: number }): void``` - Отображение счетчика товаров в корзине

### Класс ProductModalView:

Класс, наследующий ModalView<IProduct>. Отвечает за отображение модального окна карточки товара.

Конструктор:
В конструкторе принимает объект типа IEvents и IController. Описание в родительском классе.

Поля:

- ```private _inBasket: boolean``` — сигнализирует в карточке, что товар в корзине

Методы:

- ```render(data?: Partial<IProduct>): void ``` - Отвечает за отображение модального окна
- ```nextModal(): void ``` - Переключает на следующее модальное окно
- ```private _renderButton(button: HTMLButtonElement, addButtonHandler: () => void, nextModalHandler: () => void): void``` — метод реализации отрабатывающий отрисовку кнопки и ее хендлеры.

### Класс BasketModalView:

Класс, наследующий ModalView<IBasket>. Отвечает за отображение модального окна корзины.

Конструктор:
В конструкторе принимает объект типа IEvents и IController. Описание в родительском классе.

Методы:
- ```render(): void ``` - Отвечает за отображение модального окна
- ```nextModal(): void ``` - Переключает на следующее модальное окно

### Класс DetailsFormModalView:

Класс, наследующий ModalView<void> и реализующий интерфейс IFormView. Отвечает за отображение модального окна деталей о заказе.

Конструктор:
В конструкторе принимает объект типа IEvents и IController. Описание в родительском классе.

Методы:
- ```render(): void ``` - Отвечает за отображение модального окна
- ```nextModal(): void ``` - Переключает на следующее модальное окно
- ```checkFilled(): void``` — проверяет заполнена ли форма и переключает кнопку
- ```private _altButtonHandler(buttons: HTMLButtonElement[], toggleElement: number):void```  — реализует механизм выбора одну из двух кнопок
- ```private _createDetails(): IDetails``` — создает данные о заказе из формы

### Класс ContactsFormModalView:

Класс, наследующий ModalView<void> и реализующий интерфейс IFormView. Отвечает за отображение модального окна с контактной информацией.

Конструктор:
В конструкторе принимает объект типа IEvents и IController. Описание в родительском классе.

Методы:

- ```render(): void ``` - Отвечает за отображение модального окна
- ```nextModal(): void ``` - Переключает на следующее модальное окно
- ```checkFilled(): void``` — проверяет заполнена ли форма и переключает кнопку
- ```private _createContacts(): IContacts```  — создает контактные данные из формы

### Класс SuccessModalView:

Класс, наследующий ModalView<IOrderResponse>. Отвечает за отображение модального окна подтверждения успешного оформления заказа.

Конструктор:
В конструкторе принимает объект типа IEvents и IController. Описание в родительском классе.

Методы:
- ```render(data?: Partial<IOrderResponse>): void``` - Отвечает за отображение модального окна.
- ```nextModal(): void ``` - Закрывает модальное окно

## Брокер событий
### Класс EventEmitter:

Класс EventEmitter реализует брокер событий, который используется в слое Модели для управления событиями, связанными 
с изменением данных и взаимодействием между слоями Модели и Представления. Позволяет подписываться на события, генерировать 
события и уведомлять о них другие компоненты.

Конструктор:
```constructor()``` - Инициализирует _events как карту для управления подписками на события.

Поля: 
- ```_events (Map<EventName, Set>)``` — карта, где ключами являются названия событий (строка или регулярное выражение), 
а значениями — множества обработчиков событий.

Методы:
- ```on<T extends object>(eventName: EventName, callback: (event: T) => void): void```
Добавляет обработчик callback для события eventName.
- ```off(eventName: EventName, callback: Subscriber): void```
Удаляет обработчик callback для события eventName. Если у события не осталось подписчиков, оно удаляется.
- ```emit<T extends object>(eventName: string, data?: T): void```
Инициирует событие eventName, передавая в него данные data. Вызывает все подписанные обработчики.
- ```onAll(callback: (event: EmitterEvent) => void): void```
Добавляет обработчик, который будет вызван для всех событий.
- ```offAll(): void```
Удаляет все обработчики для всех событий.
- ```trigger<T extends object>(eventName: string, context?: Partial<T>): (event: T) => void```
Создает функцию, которая при вызове инициирует событие eventName с переданными данными context.

## Описание событий

- closeModal — закрытие модального окна
- openCard — открытие модального окна карточки товара
- openBasket — открытие модального окна корзины
- nextModal — вызова следующего модального окна
- updateBasket — обновление корзины
- contactsError — ошибка заполнения контактной информации
- detailsError — ошибка заполнения данных о заказе
- getProductList — получение списка товаров
- successOrder — успешное создание заказа



