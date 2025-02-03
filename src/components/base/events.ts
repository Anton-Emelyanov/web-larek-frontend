
type EventName = string | RegExp;
// eslint-disable-next-line @typescript-eslint/ban-types
type Subscriber = Function;
type EmitterEvent = {
    eventName: string,
    data: unknown
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */

export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }

        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }

    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            this._events.get(eventName)!.delete(callback);
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    emit<T extends object>(eventName: EventName, data?: T) {
        const subscribers = [...this._events.entries()]
            .filter(([name]) => (name instanceof RegExp && name.test(eventName as string)) || name === eventName)
            .flatMap(([_, subs]) => [...subs]);

        subscribers.forEach(callback => callback(data));
    }

    onAll(callback: (event: EmitterEvent) => void) {
        this.on("*", callback);
    }

    offAll() {
        this._events.clear();
    }

    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            });
        };
    }
}
