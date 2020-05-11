const Cinema = require('../cinema');
const { hashGenerator, numberGenerator } = require('../Services');

const cinema = new Cinema();

const SocketListener = class  {
    constructor(io) {
        this.io = io;

        this.io.on('connection', (socket) => {
            let guest;
            let room;

            const action = {
                enterToRoom: (data) => {
                    room = cinema.getRoom(data.room);

                    if (room) {
                        guest.connection.emit('room', { type: 'enter', enter: true, id: room.id, name: room.name });

                        room.addGuest(guest);

                        Object.keys(this.listeners).forEach(event => {
                            guest.connection.on(event, (data) => this.listeners[event](data, guest, room))
                        });

                        return;
                    }

                    socket.emit('room', { type: 'enter', enter: false });
                },
                createRoom: (data) => {
                    room = cinema.createRoom(data.room, hashGenerator());
                    guest.connection.emit('room', { type: 'create', create: true, id: room.id, name: room.name });
                    room.addGuest(guest);

                    Object.keys(this.listeners).forEach(event => {
                        guest.connection.on(event, (data) => this.listeners[event](data, guest, room))
                    });
                }
            };

            socket.on('intro', (data) => {
                const userName = data.name || `User_${numberGenerator()}`;
                guest = cinema.createGuest(userName, socket, hashGenerator());
                guest.connection.emit('intro', guest.id);

                action[data.action](data);
            });
        });
    }

    listeners = {
        disconnect(data, guest, room) {
            room.removeGuest(guest.id);
        },
        leaveRoom(data, guest, room) {
            room.removeGuest(guest.id);
            guest.connection.emit('room', {type: 'leave', leave: true})
        },
        newVideo(data, guest, room) {
            const videoData = data;
            videoData.addedBy = guest.id;

            room.updateCurrentVideo(videoData);
        },
        play(data, guest, room) {
            room.playVideo(guest.id);
        },
        stop(data, guest, room) {
            room.stopVideo(guest.id);
        },
        time(data, guest, room) {
            room.updateTime(guest.id, data);
        },
        getCurrentTime(data, guest, room) {
            room.getCurrentTime(guest.id);
        },
        currentTime(data, guest, room) {
            room.giveCurrentTime(data.forUser, data.time);
        }
    }
};

module.exports = SocketListener;