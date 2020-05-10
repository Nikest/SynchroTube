import * as React from 'react';

export interface IFieldBaseProps {
    title?: string;
    children: any;
}

export interface IFieldBaseState {
    hasError: boolean
    errorMSG: string;
}

export class FieldBase<P extends IFieldBaseProps, S extends IFieldBaseState> extends React.Component<P, S> {
    fieldElem: any = React.createRef();

    throwError = (msg?) => {
        this.setState({
            errorMSG: msg,
            hasError: true,
        })
    };

    clearError = () => {
        this.state.hasError && this.setState({hasError: false})
    }
}
