import * as React from 'react';

import { sl } from 'Services';


interface IIconProps {
    type: string;
}


export const Icon = function({ type }:IIconProps) {
    const c = sl(() => require('./Icon.scss'));

    return (
        <i className={c(`container icon-${type}`)}/>
    )
};


