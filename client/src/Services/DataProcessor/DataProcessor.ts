import { storeInterface, eventEmitter } from 'Services';

export const dataProcessor = {
    onRoom(data) {
        let type;
        let msg;
        let needToAlert = true;

        if (data.type === 'enter') {
            type = data.enter ? 'success' : 'error';
            msg = data.enter ? 'You entered to room' : 'Room does not exist';

            if (data.enter) {
                storeInterface().setData('room', data);
                history.pushState(null, null, `#${data.id}`);
            } else {
                history.pushState(null, null, `#`);
            }
        }

        if (data.type === 'create') {
            type = data.create ? 'success' : 'error';
            msg = data.create ? 'Room created' : 'Something wrong';

            if (data.create) {
                storeInterface().setData('room', data);
                history.pushState(null, null, `#${data.id}`);
            }
        }

        if (data.type === 'leave') {
            type = data.leave ? 'success' : 'error';
            msg = data.leave ? 'You left the room' : 'Something wrong';

            if (data.leave) {
                needToAlert = false;
                storeInterface().setData('room', false);
                storeInterface().setData('users', []);
                history.pushState(null, null, `#`);
            }
        }

        needToAlert && eventEmitter.emit('ALERT_MSG', { type, msg });
    },
    onNewGuest(data) {
        storeInterface().setData('users', data);
    },
    onVideo(data) {
        storeInterface().setData('video', data)
    }
};