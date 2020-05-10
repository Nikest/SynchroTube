const Room = require('./Room');
const Guest = require('./Guest');

const Cinema = class  {
    rooms = {};

    createRoom(name, id) {
        const room = new Room(name, id, this.deleteRoom.bind(this));

        this.rooms[id] = room;
        return this.rooms[id];
    }

    deleteRoom(id) {
        delete this.rooms[id];
    }

    getRoom(id) {
        return this.rooms[id];
    }

    createGuest(name, connection, id) {
        return new Guest(name, connection, id)
    }
};

module.exports = Cinema;