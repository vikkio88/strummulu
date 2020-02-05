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
                MESSAGES.STATE_UPDATE,
                {}
            ]);
            expect(creator.emit.getCall(1).args).to.deep.equal([
                MESSAGES.MESSAGE,
                { creatorId: "creatorId", roomId: "roomId", type: "createdRoom" }
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
    })
});
