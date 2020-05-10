import * as React from 'react';

export interface IOutputProps {
    onValuesUpdate?: (a) => void;
    getAPI?: (api: IOutputAPI) => void;
    onForm?: Function;
    onSubmit?: Function;
}

export interface IOutputAPI {
    getRequired?: Function;
    getValues?: Function;
    submit?: Function;
    clear?: Function;
    checkRequired?: Function;
    getErrors?: Function;
    emitError?: (fieldName: string, message: string) => void;
}

export abstract class OutputBase<P extends IOutputProps, S> extends React.Component<P, S> {
    public outputElem: any = React.createRef();
    public values = {};
    public inputs = {};
    public required = {};
    public errors = {};

    public onInputChange = (event: CustomEvent) => {
        this.values[event.detail.name] = event.detail.value;
        this.inputs[event.detail.name] = event.detail.input;

        delete this.errors[event.detail.name];

        this.update();
    };

    public update = () => {
        this.forceUpdate();
        this.props.onValuesUpdate && this.props.onValuesUpdate(this.values);
    };

    public onError = (event: CustomEvent) => {
        this.errors[event.detail.name] = true;
    };

    public getErrors = () => {
        return this.errors;
    };

    public emitError = (name: string, msg: string) => {
        this.inputs[name]['emitError'](msg)
    };

    public clearValues = (name?) => {
        if (name) {
            delete this.values[name];
            this.inputs[name].clearValue();
            return;
        }

        this.values = {};
        Object.keys(this.inputs).forEach(name => {
            this.inputs[name].clearValue();
        });
    };

    public submit = () => {
        this.props.onSubmit && this.props.onSubmit(this.values)
    };

    private onRequireCatch = (event: CustomEvent) => {
        this.required[event.detail.name] = event.detail.input;
    };

    public getRequired = () => {
        return this.required;
    };

    public getValues = () => {
        return this.values;
    };

    public checkRequired = () => {
        const checked = Object.keys(this.required).filter(key => {

            if(!this.values[key]) {
                this.required[key]['emitError']('This field is required');
            }

            return !this.values[key]
        });

        return !checked.length
    };

    public componentDidMount() {
        this.outputElem.current.addEventListener('input.change', this.onInputChange);
        this.outputElem.current.addEventListener('input.required', this.onRequireCatch);
        this.outputElem.current.addEventListener('input.error', this.onError);

        this.props.getAPI && this.props.getAPI({
            getRequired: this.getRequired,
            getValues: this.getValues,
            submit: this.submit,
            clear: this.clearValues,
            checkRequired: this.checkRequired,
            getErrors: this.getErrors,
            emitError: this.emitError,
        });
    }
}
