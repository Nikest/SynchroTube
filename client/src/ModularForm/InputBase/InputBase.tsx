import * as React from 'react';

export interface IInputProps {
    pattern?: RegExp;
    patternNot?: RegExp;
    value?: any;
    name: string;
    symbol?: string;
    validationFn?: (val: any) => any;
    required?: boolean;
}

export interface IInputState {
    valueState?: any;
    firstChanged?: boolean;
}

export interface IErrorType {
    error?: boolean;
    errorMSG?: string;
    errorType?: string
}

export class InputBase<P extends IInputProps , S extends IInputState> extends React.Component<P, S> {
    inputElem: any = React.createRef();
    autoEmit: boolean = true;
    timer;

    normalize = (val) => val;

    selfValidate = (val): IErrorType => { return {error: false} };

    onChange = (val, setState = true) => {
        const value = this.normalize(val);
        let hasError = false;

        const selfValidateRes = this.selfValidate(value);

        if(selfValidateRes.error) {
            hasError = true;
            setTimeout(() => this.emitError(selfValidateRes.errorMSG), 10);
        }

        setState && this.setState({valueState: value, firstChanged: true});
        !hasError && this.emit(value);
    };

    onInput = (e) => {
        let value = e.target.value;

        if (value < 0) {
            value = Math.abs(value);
        }
        this.onChange(value);
    };

    clearValue = () => {
        this.setState({
            valueState: this.props['value'] || undefined
        }, () => this.inputElem.current.value = null)
    };

    emit = (value) => {
        const event = new CustomEvent('input.change', {
            bubbles: true,
            detail: {
                value,
                input: this,
                name: this.props.name,
            }
        });

        this.inputElem.current && this.inputElem.current.dispatchEvent(event);
    };

    emitError = (msg?) => {
        const event = new CustomEvent('input.error', {
            bubbles: true,
            detail: {
                msg,
                name: this.props.name
            }
        });

        this.inputElem.current.dispatchEvent(event);
    };

    emitRequired = () => {
        const event = new CustomEvent('input.required', {
            bubbles: true,
            detail: {
                input: this,
                name: this.props.name
            }
        });

        setTimeout(() => {
            this.inputElem.current.dispatchEvent(event);
        }, 200)
    };

    componentDidMount() {
        const value = this.props.value;

        this.inputElem.current.inputBaseAPI = {
            clearValue: this.clearValue,
        };
        this.autoEmit && setTimeout(() => {
            this.emit(value || null);
        }, 100);

        this.props.required && this.emitRequired();
    }
}
