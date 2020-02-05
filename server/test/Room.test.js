const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const { expect } = require('chai');

const Room = require('../Room/Room');
const { MESSAGES } = require('../const');

chai.use(sinonChai);

describe('Room class tests', () => {
    const generateClient = (args = {}) => ({ id: 'creatorId', emit: sinon.spy(), ...args });
    const getGameLogic = () => ({});
    const conf = {
        maxPlayers: 2,
        idGenerator: () => 'roomId'
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
            expect(creator.emit).to.have.been.calledTwice;
            expect(creator.emit.getCall(0).args).to.deep.equal([
                MESSAGES.STATE_UPDATE,
                {}
            ]);
            expect(creator.emit.getCall(1).args).to.deep.equal([
                MESSAGES.MESSAGE,
                { creatorId: "creatorId", roomId: "roomId", type: "createdRoom" }
            ]);
        });
    });

    describe('client actions', () => {
        it('should allow clients to join, until reaches max client', () => {
            const creator = generateClient();
            const joiner1 = generateClient({ id: 'joiner1' });
            const joiner2 = generateClient({ id: 'joiner2' });
            const cannotJoiner = generateClient({ id: 'cannotJoinerId' });

            const room = factory({ creator, config: { maxPlayers: 3 } });
            let joined = room.tryJoin(joiner1);
            expect(joined).to.be.true;

        });
    })
});
