import * as React from 'react';
import { cd } from 'Services';
import { OutputBase, IOutputProps, IOutputAPI } from '../base';

interface IFormProps extends IOutputProps {
    className?: string;
    children: any;
    onError?: Function;
}

export interface IFormAPI extends IOutputAPI {
}

@cd(() => require('./Form.scss'))
export class Form extends OutputBase<IFormProps, {}> {
    render(c?) {
        const { className, children } = this.props;
        return (
            <form ref={this.outputElem} className={className || ''} onSubmitCapture={e => e.preventDefault()}>
                { children }
            </form>
        )
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.onError && this.outputElem.current.addEventListener('input.error', () => {
            this.props.onError()
        });
    }
}
