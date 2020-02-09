import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
const { expect } = chai;

import lib from '../dist';

const { clientFactory } = lib;


chai.use(sinonChai);

describe('clientFactory tests', () => {
    const socketId = 'socketId';
    const fakeUrl = 'https://someurl.com';
    const socketGenerator = () => ({ on: sinon.fake.returns(true), emit: sinon.fake(), id: socketId });
    const openSocket = sinon.fake.returns(socketGenerator());

    describe('setup', () => {
        it('should create and init an instance correctly', () => {
            const instance = clientFactory(fakeUrl, openSocket);
            expect(instance.getId()).to.be.equal(null);

            instance.init();
            expect(instance.getId()).to.be.equal(socketId);
            expect(openSocket).to.be.calledWith(fakeUrl);
        });

        it('should merge default and user defined config', () => {
            const socket = socketGenerator();
            const openSocket = sinon.fake.returns(socket);

            const instance = clientFactory(fakeUrl, openSocket);
            const { EVENTS } = instance;
            const fakeHandler = sinon.fake.returns(false)
            const config = {
                [EVENTS.MESSAGE]: fakeHandler
            };
            instance.init(config);
            expect(instance.getId()).not.to.be.equal(null);
            expect(socket.on).to.have.been.calledThrice;
            expect(socket.on.getCall(0).args).to.deep.equal([EVENTS.MESSAGE, fakeHandler]);
            const errorHandlerArgs = socket.on.getCall(1).args;
            expect(errorHandlerArgs[0]).to.be.equal(EVENTS.ERROR);
            expect(errorHandlerArgs[1]).to.be.instanceof(Function);

            const stateUpdateHandlerArgs = socket.on.getCall(2).args;
            expect(stateUpdateHandlerArgs[0]).to.be.equal(EVENTS.STATE_UPDATE);
            expect(stateUpdateHandlerArgs[1]).to.be.instanceof(Function);
        });
    });
    describe('client events', () => {
        it('should emit the right message if creating a room', () => {
            const socket = socketGenerator();
            const openSocket = sinon.fake.returns(socket);

            const instance = clientFactory(fakeUrl, openSocket);
            instance.init();

            instance.createRoom();
            expect(socket.emit).to.have.been.calledWith('createRoom', { me: socketId });
        });

        it('should emit the right message if joining a room', () => {
            const socket = socketGenerator();
            const openSocket = sinon.fake.returns(socket);

            const instance = clientFactory(fakeUrl, openSocket);
            instance.init();
            const roomId = 'roomId';
            instance.joinRoom(roomId);
            expect(socket.emit).to.have.been.calledWith('joinRoom', { roomId });
        });

        it('should emit the right message if leaving a room', () => {
            const socket = socketGenerator();
            const openSocket = sinon.fake.returns(socket);

            const instance = clientFactory(fakeUrl, openSocket);
            instance.init();
            const roomId = 'roomId';
            instance.leaveRoom(roomId);
            expect(socket.emit).to.have.been.calledWith('leaveRoom', { roomId });
        });

        it('should emit the right message if sending an action', () => {
            const socket = socketGenerator();
            const openSocket = sinon.fake.returns(socket);

            const instance = clientFactory(fakeUrl, openSocket);
            instance.init();
            const roomId = 'roomId';
            const actionType = 'someActionType';
            const actionPayload = { some: 'stuff' };
            instance.sendAction(actionType, roomId, actionPayload);
            expect(socket.emit).to.have.been.calledWith(
                'action',
                { type: actionType, roomId, payload: actionPayload }
            );
        });
    });
});