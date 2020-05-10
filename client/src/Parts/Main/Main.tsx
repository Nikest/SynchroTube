import * as React from 'react';

import {cd, storeInjector} from 'Services';
import { Video, Enter, Alert } from 'Components';

interface IMainProps {

}

interface IMainState {
    users: any[];
    room: boolean;
}

@cd(() => require('./Main.scss'))
export class Main extends React.Component<IMainProps, IMainState> {
    state = {
        users: [],
        room: false,
    };

    render(c?) {
        const { users, room } = this.state;

        return (
            <main className={c('container')}>
                <div className={c('users-wrapper')}>
                    {
                        users.map(user => {
                            return (
                                <div key={user.id} className={c('user')}>{ user.name }</div>
                            )
                        })
                    }
                </div>

                <div className={c('action-wrapper')}>
                    <div className={c('alert')}><Alert/></div>
                    { room ? <Video/> : <Enter/> }
                </div>
            </main>
        )
    }

    @storeInjector(['users'])
    onUsersUpdate({users}) {
        this.setState({users});
    }

    @storeInjector(['room'])
    onRoomUpdate({room}) {
        this.setState({room});
    }
}
