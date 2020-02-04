const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const { expect } = require('chai');

chai.use(sinonChai);

class Stuff {
    constructor(test) {
        this.test = test.stuff();
    }
}

describe('Room class tests', () => {

    describe('constructor', () => {
        it('should create a correct instance', () => {
            const fake = sinon.fake.returns('ciao');
            const testMock = { stuff: fake };
            const stuff = new Stuff(testMock);
            expect(testMock.stuff).to.be.calledOnceWith();
            expect(stuff.test).to.be.equal('ciao');
        });
    });
});
