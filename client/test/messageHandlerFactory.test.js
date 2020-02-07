import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
const { expect } = chai;

import lib from '../index.js';

const { messageHandlerFactory } = lib;


chai.use(sinonChai);

describe('messageHandlerFactory tests', () => {
    const messageHandler = messageHandlerFactory();
    describe('setup', () => {
        it('should generate a function with defaults', () => {
            expect(messageHandler).to.be.instanceof(Function);
        });
    });

    describe('custom type-handler config', () => {
        it('should throw an error if defaults are not set', () => {
            const generator = () => {
                messageHandlerFactory({}, {});
            };

            expect(generator).to.throw;
        });

        it('should respond to the right message type with the right handler', () => {
            const types = {
                banana: 'banana',
                anotherType: 'anotherType',
                default: 'default'
            };

            const returning = { some: 'stuff' };

            const handlers = {
                [types.banana]: sinon.fake.returns(returning),
                [types.anotherType]: sinon.fake(),
                default: () => { }
            };

            const messageHandler = messageHandlerFactory(types, handlers);
            const message = {
                type: types.banana
            }
            const result = messageHandler(message, {});

            expect(result).to.deep.equal(returning);
            expect(handlers[types.banana]).to.have.been.calledWith(message, {});
            expect(handlers[types.anotherType]).not.to.be.called;
        });

        it('should call default if no handlers are set for the message type', () => {
            const types = {
                banana: 'banana',
                anotherType: 'anotherType',
                default: 'default'
            };

            const returning = { some: 'stuff' };

            const handlers = {
                [types.banana]: () => { },
                [types.anotherType]: () => { },
                default: sinon.fake.returns(returning)
            };

            const messageHandler = messageHandlerFactory(types, handlers);
            const message = {
                type: 'someWeirdType'
            }
            const result = messageHandler(message, {});

            expect(result).to.deep.equal(returning);
            expect(handlers[types.default]).to.have.been.calledWith(message, {});
        });


    });
});