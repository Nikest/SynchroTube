const subscriberEvents = {};

const subscribe = (eventName: string, fn: Function) => {
    if (!subscriberEvents[eventName]) {
        subscriberEvents[eventName] = [];
    }

    subscriberEvents[eventName].push(fn);
};

const emit = (eventName: string, data: any = null) => {
    subscriberEvents[eventName] && subscriberEvents[eventName].forEach(fn => fn(data))
};

const onEmit  = (eventName: string) => (Component, method) => {
    const componentDidMount = Component.constructor.prototype.componentDidMount;

    Component.constructor.prototype.componentDidMount = function() {
        componentDidMount && componentDidMount.call(this);
        subscribe(eventName, this[method].bind(this));
    }
};


export const eventEmitter = {
    subscribe, emit, onEmit
};
