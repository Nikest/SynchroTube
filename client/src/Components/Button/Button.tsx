import * as React from 'react';

import { sl } from 'Services';
import { Icon } from 'Components';


interface IButtonProps {
    icon?: string;
    children?: any;
    onClick?: () => void;
    mod?: string;
}


export const Button = function({ icon, children, onClick, mod}:IButtonProps) {
    const c = sl(() => require('./Button.scss'));
    const  classList = `container ${mod === 'icon' ? 'icon' : ''}`;

    return (
        <button className={c(classList)} onClick={() => onClick()}>
            {icon && <Icon type={icon}/>}
            {children}
        </button>
    )
};


