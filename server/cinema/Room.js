const hashGenerator = require('../Services').hashGenerator;

const Room = class  {
    deleteSelf;
    name = '';
    id = '';

    guests = [];
    currentVideo = {
        videoId: '',
        type: '',
        addedBy: '',
        playing: false,
        added: false,
        played: false,
    };

    constructor(name, id, deleteFn) {
        this.name = name;
        this.id = id;
        this.deleteSelf = () => deleteFn(this.id);
    }

    addGuest(guest) {
        this.currentVideo.added === true && guest.connection.emit('video', this.currentVideo);

        this.guests.push(guest);
        this.onGuestsUpdated();
    }

    onGuestsUpdated() {
        if (this.guests.length === 0) {
            this.deleteSelf();
            return;
        }

        const eventHash = hashGenerator();

        const allGuests = this.guests.map(g => {
            return {
                eventHash,
                name: g.name,
                id: g.id
            }
        });

        this.emitToAll('newGuest', allGuests)
    }

    removeGuest(id) {
        const position = this.guests.findIndex(g => g.id === id);
        position !== -1 && this.guests.splice(position, 1);

        this.onGuestsUpdated();
    }

    for(guestId) {
        return {
            emit: (event, data) => {
                this.guests.forEach(guest => {
                    if (guest.id === guestId) {
                        guest.connection.emit(event, data);
                    }
                });
            }
        }
    }

    emitToAll(eventName, data) {
        this.guests.forEach(guest => {
            guest.connection.emit(eventName, data);
        });
    }

    exept(guestId) {
        return {
            emit: (event, data) => {
                this.guests.forEach(guest => {
                    if (guest.id !== guestId) {
                        guest.connection.emit(event, data);
                    }
                });
            }
        }
    }

    updateCurrentVideo(videoData) {
        this.currentVideo = videoData;
        this.currentVideo.added = true;

        this.exept(videoData.addedBy).emit('video', this.currentVideo)
    }

    playVideo(initBy) {
        this.currentVideo.playing = true;
        this.currentVideo.played = true;

        if (this.currentVideo.added) {
            this.exept(initBy).emit('play', this.currentVideo);
            return;
        }

        this.emitToAll('errorMSG', 'Video not found');
    }

    stopVideo(initBy) {
        this.currentVideo.playing = false;

        if (this.currentVideo.added) {
            this.exept(initBy).emit('stop', this.currentVideo);
            return;
        }

        this.emitToAll('error', 'Video not found');
    }

    updateTime(initBy, time) {
        if (this.currentVideo.added) {
            this.exept(initBy).emit('time', time);
            return;
        }

        this.emitToAll('error', 'Video not found');
    }

    getCurrentTime(initBy) {
        this.for(this.currentVideo.addedBy).emit('needCurrentTime', initBy)
    }

    giveCurrentTime(forGuest, time) {
        this.for(forGuest).emit('updateCurrentTime', time);
    }
};

module.exports = Room;