const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const { expect } = require('chai');

const { Server } = require('../Server');
const { MESSAGES } = require('../const')

chai.use(sinonChai);

class MockRoom {
    constructor() {
        this.id = 'fakeRoomId';
        this.players = new Map();
    }

    tryJoin() {
        return true;
    }

    has() {
        return true;
    }

    leave() {

    }

    playerAction() {

    }
}

describe('Server class tests', () => {
    const mockRoomInstance = new MockRoom();
    const config = { roomFactory: () => mockRoomInstance, verbose: false };
    const factory = (conf = config) => new Server(conf);

    describe('constructor', () => {
        it('should create an instance correctly', () => {
            expect(factory).not.to.throw(Error);
            const server = factory();
            expect(server.rooms).to.be.a('Map').that.is.empty;
            expect(server.connections).to.be.a('Map').that.is.empty;
            expect(server.connectionRooms).to.be.a('Map').that.is.empty;
        });

        it('should report an error if created without the right parameters', () => {
            const factory = () => { new Server(); }
            expect(factory).to.throw(Error);
        });
    });

    describe('base events', () => {
        it('should save client on connection', () => {
            const clientId = 'someClient';
            const connection = { some: 'stuff' };
            const server = factory();

            server.connected(clientId, connection);

            expect(server.connections).to.include(connection);
        });

        it('should drop client on disconnection', () => {
            const clientId = 'someClient';
            const connection = { some: 'stuff' };
            const server = factory();
            server.connected(clientId, connection);

            expect(server.connections).to.include(connection);

            server.disconnected(clientId);
            expect(server.connections).not.to.include(connection);
        });
    });

    describe('client action events', () => {
        it('should create a room via the room factory', () => {
            const client = { id: 'someClientId' };
            const server = factory();
            server.createRoom(client, {});
            expect(server.rooms).to.include(mockRoomInstance);
            expect(server.rooms.get(mockRoomInstance.id)).to.be.equal(mockRoomInstance);
            expect(server.connectionRooms).to.include(mockRoomInstance.id);
            expect(server.connectionRooms.get(client.id)).to.be.equal(mockRoomInstance.id);
        });

        it('should let a client to join a previously created room', () => {
            const creator = { id: 'someClientId' };
            const joiner = { id: 'someJoinerId' };
            const { id: roomId } = mockRoomInstance;
            const server = factory();
            server.createRoom(creator, {});
            expect(server.rooms).to.include(mockRoomInstance);

            server.joinRoom(roomId, joiner);
            expect(server.connectionRooms.get(joiner.id)).to.be.equal(mockRoomInstance.id);
        });

        it('should not let a client join a non existing room', () => {
            const joiner = { id: 'someJoinerId', emit: sinon.fake.returns(true) };
            const server = factory();
            const nonExistingRoomId = 'nonExistingRoomId';
            expect(server.rooms).to.be.a('Map').that.is.empty;
            expect(server.joinRoom(nonExistingRoomId, joiner)).to.be.false;
            expect(joiner.emit).to.be.calledOnceWith(MESSAGES.ERROR, 'Room nonExistingRoomId does not exist');
        });

        it('should not let a client join a room if the check fails at room level', () => {
            const closedRoomInstance = new MockRoom();
            closedRoomInstance.tryJoin = sinon.fake.returns(false);
            const config = { roomFactory: () => closedRoomInstance, verbose: false };
            const joiner = { id: 'someJoinerId', emit: sinon.fake.returns(true) };
            const server = factory(config);
            const creator = { id: 'someClientId' };
            server.createRoom(creator, {});
            expect(server.rooms).to.include(closedRoomInstance);
            expect(server.joinRoom(closedRoomInstance.id, joiner)).to.be.false;
            expect(closedRoomInstance.tryJoin).to.be.calledOnceWith();
            expect(joiner.emit).not.to.be.called;
        });

        it('should let a client leave a room if that room has the client in', () => {
            const joiner = { id: 'someJoinerId', emit: sinon.fake.returns(true) };
            const server = factory();
            const creator = { id: 'someClientId' };
            server.createRoom(creator, {});
            expect(server.rooms).to.include(mockRoomInstance);
            expect(server.joinRoom(mockRoomInstance.id, joiner)).to.be.true;
            expect(server.joinRoom(mockRoomInstance.id, joiner)).to.be.true;

            expect(server.leaveRoom(mockRoomInstance.id, joiner)).to.be.true;
            expect(joiner.emit).not.called;
        });

        it('should not let a client leave a room if the room does not exist', () => {
            const server = factory();
            const creator = { id: 'someClientId' };
            const joiner = { id: 'someJoinerId', emit(type) { return type; } };
            server.createRoom(creator, {});
            expect(server.rooms).to.include(mockRoomInstance);
            expect(server.leaveRoom('someUnExistingRoomId', joiner)).to.be.false;
        });

        it('should not let a client leave a room if the client is not in it', () => {
            const roomInstance = new MockRoom;
            roomInstance.has = sinon.fake.returns(false);
            const config = { roomFactory: () => roomInstance, verbose: false };
            const server = factory(config);
            const creator = { id: 'someClientId' };
            const joiner = { id: 'someJoinerId', emit: sinon.fake.returns(false) };
            server.createRoom(creator, {});
            expect(server.rooms).to.include(roomInstance);
            expect(server.leaveRoom(mockRoomInstance.id, joiner)).to.be.false;
            expect(joiner.emit).to.be.calledOnceWith(MESSAGES.ERROR, 'Action not allowed in room fakeRoomId');
        });

        it('should allow the user to perform an action if he is in the room', () => {
            const creator = { id: 'someClientId' };
            const joiner = { id: 'someJoinerId' };
            const { id: roomId } = mockRoomInstance;
            const server = factory();
            server.createRoom(creator, {});
            server.joinRoom(roomId, joiner);

            expect(server.clientAction(joiner, 'someAction', mockRoomInstance.id, {}))
                .to.be.true;
        });

        it('should not allow the user to perform an action if there is no room', () => {
            const joiner = { id: 'someJoinerId', emit: sinon.fake.returns(true) };
            const server = factory();
            server.createRoom(joiner, {});

            expect(server.clientAction(joiner, 'someAction', 'anotherRoomId', {}))
                .to.be.false;
            expect(joiner.emit).to.be.calledWith(MESSAGES.ERROR, 'Non existing room anotherRoomId');
        });

        it('should not allow the user to perform an action if he is not in the room', () => {
            const roomInstance = new MockRoom;
            roomInstance.has = sinon.fake.returns(false);
            const config = { roomFactory: () => roomInstance, verbose: false };
            const server = factory(config);
            const creator = { id: 'someClientId' };
            const joiner = { id: 'someJoinerId', emit: sinon.fake.returns(true) };
            server.createRoom(creator, {});

            expect(server.clientAction(joiner, 'someAction', roomInstance.id, {}))
                .to.be.false;
            expect(roomInstance.has).to.be.called;
            expect(joiner.emit).to.be.calledWith(MESSAGES.ERROR, 'Action not allowed in room fakeRoomId');
        });

    });
})