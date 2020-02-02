const { expect } = require('chai');
const Server = require('../game/Server');


describe('Server class tests', () => {
    const config = { roomFactory: () => { } };
    const factory = () => new Server(config);

    describe('constructor', () => {
        it('should create a correct instance', () => {
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

    });
})