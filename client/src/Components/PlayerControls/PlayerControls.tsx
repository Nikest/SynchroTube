import * as React from 'react';

import { cd } from 'Services';


interface IPlayerControlsProps {

}


interface IPlayerControlsState {

}

@cd(() => require('./PlayerControls.scss'))
export class PlayerControls extends React.Component<IPlayerControlsProps, IPlayerControlsState> {
    render(c?) {
        return (
            <div className={c('container')}>PlayerControls</div>
        )
    }
}



