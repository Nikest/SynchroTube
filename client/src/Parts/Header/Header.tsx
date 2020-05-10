import * as React from 'react';

import {cd, storeInterface, DataRequester, storeInjector} from 'Services';
import { Form, InputArea, IFormAPI, SelectFile } from 'ModularForm';
import { Button, RoomProperties, SearchEngine } from 'Components';

interface IRoom {
    name?: string;
    id?: string;
}

interface IHeaderProps {

}

interface IHeaderState {
    room: IRoom;
}

@cd(() => require('./Header.scss'))
export class Header extends React.Component<IHeaderProps, IHeaderState> {
    state = {
        room: null
    };

    render(c?) {
        const { room } = this.state;

        return (
            <header className={c('container')}>
                {
                    room && (
                        <div className={c('room')}>
                            <RoomProperties roomName={room.name} roomId={room.id}/>
                        </div>
                    )
                }

                { room && <SearchEngine/> }
            </header>
        )
    }

    @storeInjector(['room'])
    onRoomUpdate({room}) {
        this.setState({room});
    }
}
