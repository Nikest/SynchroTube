import * as React from 'react';

import { cd } from 'Services';
import { InputBase, IInputState, IInputProps } from '../base';

export interface ICheckButtonData {
    text: string;
    value: any;
    checked?: boolean;
}

interface ICheckButtonProps extends IInputProps{
    data: ICheckButtonData[];
    className?: string;
}


interface IState extends IInputState {}

@cd(() => require('./CheckButton.scss'))
export class CheckButton extends InputBase<ICheckButtonProps, IState> {
    firstEmit: boolean = false;

    render(c?) {
        const { data, name, className } = this.props;

        return (
            <div className={c('container')} ref={this.inputElem}>
                {
                    data.map((check, i) => {
                        (check.checked && !this.firstEmit) && setTimeout((input) => {input.emit(check.value); input.firstEmit = true}, 500, this);

                        return (
                            <label key={i} className={c(`cell ${className ? className : ''}`)}>
                                <input name={name} type={'radio'} defaultChecked={check.checked} onChange={() => this.onChange(check.value)}/>
                                <span className={c('decor')}>{check.text}</span>
                            </label>
                        )
                    })
                }
            </div>
        )
    }
}



