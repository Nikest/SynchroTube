import * as React from 'react';

import { cd, DataRequester } from 'Services';
import { Button } from 'Components';


interface IRoomPropertiesProps {
    roomName: string;
    roomId: string;
}


interface IRoomPropertiesState {

}

@cd(() => require('./RoomProperties.scss'))
export class RoomProperties extends React.Component<IRoomPropertiesProps, IRoomPropertiesState> {
    render(c?) {
        const { roomName, roomId } = this.props;

        return (
            <div className={c('container')}>
                <span className={c('cell')}>Room name:</span>
                <span className={c('cell decor')}>{ roomName }</span>

                <span className={c('cell')}>Room ID:</span>
                <span className={c('cell decor id')}>{ roomId } <Button icon={'copy'} mod={'icon'}/></span>

                <Button onClick={this.onRoomLeave}>Leave room</Button>
            </div>
        )
    }

    onRoomLeave = () => {
        DataRequester.leaveRoom();
    }
}



