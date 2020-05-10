import { eventEmitter } from 'Services';

const storage = {};

const storageObserver = new Proxy(storage, {
    get(target, field) {
        if (!target[field]) {
            target[field] = new StoreField(field);
        }
        return target[field]
    },
    set(target, field, val) {
        if (!target[field]) {
            target[field] = new StoreField(field);
        }

        target[field].data = val;
        eventEmitter.emit(`store.updated`);
        return true;
    }
});

class StoreField {
    private _subscriptions = [];
    private _data: any = null;
    private afterUpdate = () => {
        this._subscriptions.forEach(s => s(this))
    };

    name = '';
    constructor(name) {
        this.name = name;
    }

    get data() {
        return this._data
    }
    set data(val) {
        this._data = val;
        this.afterUpdate();
    }

    subscribe = (subscriber: Function) => {
        this._subscriptions.push(subscriber);
        this._data && subscriber(this);
    };

    trigger = () => this._subscriptions.forEach(s => s(this))
}

export const storeInterface = () => {
    return {
        getData: (field: string) => {
            return storageObserver[field].data
        },
        setData: (field: string, value: any) => {
            storageObserver[field] = value;
        },
        triggerField: (field: string) => {
            storageObserver[field].trigger();
        },
        subscribeTo: (field: string | string[], fn: Function) => {
            if (field instanceof Array) {
                field.forEach(f => storeInterface().subscribeTo(f, fn));
                return;
            }

            storageObserver[field].subscribe(fn);
        }
    }
};

export const storeInjector = (storeFields: string[], checkingFields?: boolean) => (Component, method) => {
    const componentDidMount = Component.constructor.prototype.componentDidMount;

    Component.constructor.prototype.componentDidMount = function() {
        typeof componentDidMount === 'function' && componentDidMount.call(this);

        if(storeFields.length === 1) {
            const data = {};
            storeInterface().subscribeTo(storeFields, (field) => {
                data[storeFields[0]] = field.data;
                if (checkingFields) {
                    data[storeFields[0]] && this[method](data);
                    return
                }
                this[method](data);
            });
            return;
        }

        if (storeFields.length > 1) {
            storeInterface().subscribeTo(storeFields, (field) => {
                const data = {};
                storeFields.forEach(key => {
                    data[key] = storeInterface().getData(key)
                });
                let empty = checkingFields ? !!Object.keys(data).filter(k => !data[k]).length : false;
                !empty && this[method](data);
            });
        }
    };
};
