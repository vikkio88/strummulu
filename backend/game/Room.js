const generateId = () => Math.random().toString(36).substr(2, 5);

class Room {

    constructor(creatorId, maxSits = 2) {
        this.id = generateId()

        this.maxSits = maxSits;
        this.connections = [];

        this.connections.push(creatorId);
    }


    join(joinerId) {

        if (this.connections.indexOf(joinerId) > -1 || this.connections.length >= this.maxSits) {
            return false;
        }

        this.connections.push(joinerId);

        return true;
    }

}

module.exports = Room;