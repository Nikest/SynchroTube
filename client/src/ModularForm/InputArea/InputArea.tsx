import * as React from 'react';
import { cd } from 'Services';
import { InputBase, IInputState, IInputProps } from '../base';


export interface IInputAreaProps extends IInputProps {
    placeholder?: string;
    textarea?: boolean;
    type?: string;
}

interface IState extends IInputState {}

@cd(() => require('./InputArea.scss'))
export class InputArea extends InputBase<IInputAreaProps, IState> {
    state = {
        valueState: '',
        firstChanged: false,
    };

    selfValidate = (val) =>  {
        const { patternNot, pattern, validationFn } = this.props;
        let error = false;

        if(pattern) {
            const regexp = new RegExp(pattern);
            if(!regexp.test(val)) {
                error = true;
            }
        }

        if(patternNot) {
            const regexp = new RegExp(patternNot);
            if(regexp.test(val)) {
                error = true;
            }
        }

        if(validationFn) {
            const validation = validationFn(val);
            if(typeof validation === 'object') {
                error = true;
            } else if (!validation) {
                error = true;
            }
        }

        return {error};
    };

    public render(c?) {
        const {
            value,
            placeholder,
            name,
            textarea,
            type,
        } = this.props;

        const valueState = this.state ? this.state.valueState : undefined;
        const firstChanged = this.state ? this.state.firstChanged : false;
        const inputVal = firstChanged ? valueState : value;

        return (
            <div className={c('container')}>
                {
                    textarea &&
                    <textarea
                        ref={this.inputElem}
                        name={name || ''}
                        placeholder={placeholder || ''}
                        onInput={this.onInput}
                        rows={5}> </textarea>
                }
                {
                    !textarea &&
                    <input
                        ref={this.inputElem}
                        type={type || 'text'}
                        placeholder={placeholder || ''}
                        name={name || ''}
                        value={inputVal || '' }
                        onChange={this.onInput}
                    />
                }
            </div>
        );
    }
}
