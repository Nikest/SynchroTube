import * as React from 'react';
import { cd } from 'Services';
import { FieldBase, IFieldBaseProps, IFieldBaseState } from '../base';

interface ILabelProps extends IFieldBaseProps {
    className?: string;
    errorMSG?: string;
}

interface ILabelState extends IFieldBaseState {

}

@cd(() => require('./Label.scss'))
export class Label extends FieldBase<ILabelProps, ILabelState> {
    state = {
        hasError: false,
        errorMSG: ''
    };
    render(c?) {
        const { children, title, className, errorMSG } = this.props;
        const { hasError } = this.state;
        const classList = `${c('container')} ${className || ''}`;
        const wrapperClassList = `${c('wrapper')} ${c(hasError ? 'error-status' : '')}`;

        return (
            <label ref={this.fieldElem} className={classList}>
                {title && <span className={c('title')}>{title}</span>}
                { (hasError && errorMSG) ? <span className={c('error-msg')}>
                    {this.state.errorMSG ? this.state.errorMSG : errorMSG}
                </span> : null }
                <span className={wrapperClassList}>{children}</span>
            </label>
        )
    }

    componentDidMount(): void {
        this.fieldElem.current.addEventListener('input.error', (e) => {
            this.throwError(e.detail.msg);
        });

        this.fieldElem.current.addEventListener('input.change', () => {
            this.clearError();
        });
    }
}
