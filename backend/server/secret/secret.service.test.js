const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');

const { expect } = chai;
const { stub, resetHistory, match } = sinon;

chai.should();
chai.use(sinonChai);

describe('secret.service', () => {
  let result;

  const save = stub();
  const getByHash = stub();

  function secretStub() {
    this.save = save;
  }
  secretStub.getByHash = getByHash;

  const encriptifyStub = {
    decrypt: stub(),
    encrypt: stub(),
    toBase64: stub(),
    toHex: stub(),
  };

  const secretService = proxyquire('./secret.service', {
    './secret.model': secretStub,
    '../helpers/encriptify': encriptifyStub,
  });

  context('get ok', () => {
    const input = 'hash';
    const secret = {
      hash: 'hash',
      secretText: 'hello world',
      createdAt: '2021-07-08 20:53:25.564',
      expiresAt: null,
      remainingViews: 10,
    };

    before(async () => {
      secretStub.getByHash.resolves(secret);
      encriptifyStub.toBase64.returns(input.toString('base64'));

      encriptifyStub.decrypt.returns(secret.secretText);
      result = await secretService.get(input);
    });

    after(resetHistory);

    it('called secretStub.getByHash', () => {
      expect(secretStub.getByHash).to.have.been.calledOnce;
      expect(secretStub.getByHash).to.have.been.calledWith(match(input.toString('base64')));
    });

    it('called encriptifyStub.decrypt', () => {
      expect(encriptifyStub.decrypt).to.have.been.calledOnce;
      expect(encriptifyStub.decrypt).to.have.been.calledWith(input);
    });

    it('returned result', () => {
      expect(result).to.equal(secret);
    });
  });
  context('create ok', () => {
    const payload = {
      secret: 'hello world',
      expireAfterViews: '10',
      expireAfter: 0
    };
    const secret = {
      hash: 'hash',
      secretText: 'hello world',
      createdAt: '2021-07-08 20:53:25.564',
      expiresAt: null,
      remainingViews: 10,
    };

    before(async () => {
      encriptifyStub.encrypt.returns('encrypted');
      encriptifyStub.toHex.returns(secret.toString('hex'));
      save.resolves(secret);

      result = await secretService.create(payload);
    });

    after(resetHistory);

    it('called secretStub.save', () => {
      expect(save).to.have.been.calledOnce;
    });

    it('called encriptifyStub.encrypt', () => {
      expect(encriptifyStub.encrypt).to.have.been.calledOnce;
      expect(encriptifyStub.encrypt).to.have.been.calledWith(payload.secret);
    });

    it('called encriptifyStub.toHex', () => {
      expect(encriptifyStub.toHex).to.have.been.calledOnce;
      expect(encriptifyStub.toHex).to.have.been.calledWith('hash');
    });

    it('returned result', () => {
      expect(result).to.equal(secret);
    });
  });
});
