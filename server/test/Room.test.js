const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const { expect } = require('chai');

const Room = require('../Room/Room');
const { MESSAGES, MESSAGE_TYPES } = require('../const');

chai.use(sinonChai);

describe('Room class tests', () => {
    const generateClient = (args = {}) => ({ id: 'creatorId', emit: sinon.spy(), ...args });
    const getGameLogic = () => ({});
    const conf = {
        maxPlayers: 2,
        idGenerator: () => 'roomId',
        verbose: false
    };

    const factory = ({ creator = generateClient(), gameLogic = getGameLogic(), config = conf }) => {
        return new Room(creator, gameLogic, config);
    }
    describe('constructor', () => {
        it('should create an instance correctly', () => {
            const creator = generateClient();
            const roomInstance = factory({ creator });
            expect(roomInstance.id).to.be.equal('roomId');
            expect(roomInstance.maxPlayers).to.be.equal(2);
            expect(roomInstance.verbose).to.be.equal(conf.verbose);
            expect(creator.emit).to.have.been.calledTwice;
            expect(creator.emit.getCall(0).args).to.deep.equal([
                MESSAGES.MESSAGE,
                { creatorId: "creatorId", roomId: "roomId", type: "createdRoom" }
            ]);
            expect(creator.emit.getCall(1).args).to.deep.equal([
                MESSAGES.STATE_UPDATE,
                {}
            ]);
        });
    });

    describe('joining actions', () => {
        it('should let clients join via tryJoin under the right conditions', () => {
            const creator = generateClient();
            const joiner1 = generateClient({ id: 'joiner1' });
            const joiner2 = generateClient({ id: 'joiner2' });
            const cannotJoiner = generateClient({ id: 'cannotJoinerId' });

            const room = factory({ creator, config: { ...conf, maxPlayers: 3 } });
            room.onJoin = sinon.spy();
            let joined = room.tryJoin(joiner1);
            expect(joined).to.be.true;
            expect(creator.emit).to.have.been.calledThrice;
            expect(joiner1.emit).to.have.been.calledOnce;
            expect(room.has(joiner1)).to.be.true;

            joined = room.tryJoin(joiner2);
            expect(joined).to.be.true;
            expect(creator.emit.callCount).to.be.equal(4);
            expect(joiner1.emit).to.have.been.calledTwice;
            expect(joiner2.emit).to.have.been.calledOnce;
            expect(room.has(joiner2)).to.be.true;

            joined = room.tryJoin(cannotJoiner);
            expect(joined).to.be.false;
            expect(creator.emit.callCount).to.be.equal(4);
            expect(joiner1.emit).to.have.been.calledTwice;
            expect(joiner2.emit).to.have.been.calledOnce;
            expect(cannotJoiner.emit).to.have.been.calledWith(MESSAGES.ERROR, 'Cannot join room roomId');
            expect(room.has(cannotJoiner)).to.be.false;

            expect(room.onJoin).to.have.been.calledTwice;
            expect(room.onJoin.getCall(0).args).to.deep.equal([{ joinerId: joiner1.id }]);
            expect(room.onJoin.getCall(1).args).to.deep.equal([{ joinerId: joiner2.id }]);
        });
    });

    describe('leaving actions', () => {
        it('should let joined clients to leave', () => {
            const creator = generateClient();
            const joiner = generateClient({ id: 'joinerId' });

            const room = factory({ creator });
            room.onLeave = sinon.fake();
            room.tryJoin(joiner);
            expect(room.has(creator)).to.be.true;
            expect(room.has(joiner)).to.be.true;

            room.leave(joiner.id);
            expect(room.has(joiner)).to.be.false;
            expect(room.onLeave).to.have.been.calledWith({ leaverId: joiner.id });
            expect(creator.emit).to.have.been.calledWith(
                MESSAGES.MESSAGE,
                { type: MESSAGE_TYPES.LEFT_ROOM, leaverId: joiner.id }
            );
        });
    });

    describe('playerAction actions', () => {
        it('should proxy the action to the right method', () => {
            const creator = generateClient();
            const joiner = generateClient({ id: 'joinerId' });
            const actionType = 'actionType';
            const actionPayload = { some: 'stuff' };

            const room = factory({ creator });
            room.onAction = sinon.fake();
            room.join(joiner);

            room.playerAction(joiner, actionType, actionPayload);
            expect(room.onAction).to.have.been.calledWith(
                { client: joiner, type: actionType, payload: actionPayload }
            );
        });
    });

    describe('broadcasts', () => {
        it('should broadcast to each player in room, on gameStateUpdate', () => {
            const creator = generateClient();
            const joiner = generateClient({ id: 'joinerId' });

            const newGameState = { something: 'happened' };

            const room = factory({ creator });
            room.onAction = sinon.fake();
            room.join(joiner);

            room.gameState = newGameState;
            room.broadcastStateUpdate();

            expect(creator.emit).to.have.been.calledWith(MESSAGES.STATE_UPDATE, newGameState);
            expect(joiner.emit).to.have.been.calledWith(MESSAGES.STATE_UPDATE, newGameState);
        });
    });
});
