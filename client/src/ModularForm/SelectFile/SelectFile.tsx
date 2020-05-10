import * as React from 'react';

import { cd } from 'Services';
import { InputBase, IInputState, IInputProps } from '../base';


interface ISelectFileProps extends IInputProps {
    placeholder: any;
    className?: string;
}


interface ISelectFileState extends IInputState {

}

@cd(() => require('./SelectFile.scss'))
export class SelectFile extends InputBase<ISelectFileProps, ISelectFileState> {
    render(c?) {
        const { placeholder, className } = this.props;
        const classList = `container ${className ? className : ''}`;
        return (
            <label className={c(classList)} ref={this.inputElem}>
                <span>{placeholder}</span>
                <input type="file" className={c('hidden')} onChange={this.onFileChange}/>
            </label>
        )
    }

    onFileChange = ({target}) => {
        target.files[0].src = URL.createObjectURL(target.files[0]);
        this.onChange(target.files[0])
    }
}



