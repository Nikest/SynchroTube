import { storeInterface, eventEmitter, dataProcessor } from 'Services';


declare const io: Function;
const socket = io();

socket.on('connect', () => {
    console.log('socket connection');
});

socket.on('video', (video) => {
    dataProcessor.onVideo(video);
});

socket.on('play', () => {
    eventEmitter.emit('play');
});

socket.on('stop', () => {
    eventEmitter.emit('stop');
});

socket.on('time', (data) => {
    eventEmitter.emit('time', data);
});

socket.on('newGuest', (data) => {
    dataProcessor.onNewGuest(data);
});

socket.on('room', (data) => {
    dataProcessor.onRoom(data)
});

socket.on('errorMSG', (data) => {
    eventEmitter.emit('ALERT_MSG', { type: 'error', msg: data });
});

socket.on('needCurrentTime', (data) => {
    eventEmitter.emit('needCurrentTime', data);
});

socket.on('updateCurrentTime', (data) => { console.log('updateCurrentTime', data);
    eventEmitter.emit('updateCurrentTime', data);
});

socket.on('disconnect', data => { console.log('disconnect');
    eventEmitter.emit('ALERT_MSG', { type: 'error', msg: 'Lost server connection' });
    setTimeout(() => {
        storeInterface().setData('room', false);
        storeInterface().setData('users', []);
        history.pushState(null, null, `#`);
    }, 3000)
});


export const DataRequester = {
    emitNewVideo: (data: any) => {
        socket.emit('newVideo', data);
    },
    sendPlay: () => {
        socket.emit('play', true);
    },
    sendStop: () => {
        socket.emit('stop', true);
    },
    sendTime: (time: number) => {
        socket.emit('time', time);
    },
    intro: (data) => {
        socket.emit('intro', data);
    },
    leaveRoom: () => {
        socket.emit('leaveRoom', true);
    },
    stream: (data) => {
        socket.emit('stream', data);
    },
    getCurrentTime: () => {
        socket.emit('getCurrentTime');
    },
    giveCurrentTime: (time, forUser) => {
        socket.emit('currentTime', {time, forUser});
    }
};