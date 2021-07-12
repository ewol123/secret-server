const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');

const { expect } = chai;
const { stub, resetHistory, match } = sinon;

chai.should();
chai.use(sinonChai);

describe('secret.controller', () => {
  let result;

  const secretServiceStub = {
    get: stub(),
    create: stub(),
  };

  const res = {
    json: stub(),
    status: stub().returns()
  };
  const next = stub();

  const secretController = proxyquire('./secret.controller', {
    './secret.service': secretServiceStub,
  });

  context('get ok', () => {
    const input = 'hash';
    const secret = {
      hash: 'hash',
      secretText: 'hash',
      createdAt: '2021-07-08 20:53:25.564',
      expiresAt: null,
      remainingViews: 10,
    };

    before(async () => {
      secretServiceStub.get.resolves(secret);
      res.json.returns(secret);

      const req = {
        params: {
          hash: input,
        },
      };
      result = await secretController.get(req, res, next);
    });

    after(resetHistory);

    it('called secretServiceStub.get', () => {
      expect(secretServiceStub.get).to.have.been.calledOnce;
      expect(secretServiceStub.get).to.have.been.calledWith(match(input.toString('base64')));
    });

    it('called res.json', () => {
      expect(res.json).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledWith(secret);
    });

    it('returned result', () => {
      expect(result).to.equal(secret);
    });
  });

  context('get fails', () => {
    const input = 'hash';
    const error = new Error('test');
    before(async () => {
      next.returns(error);
      secretServiceStub.get.throws(error);
      const req = {
        params: {
          hash: input,
        },
      };
      result = await secretController.get(req, res, next);
    });

    after(resetHistory);

    it('called next', () => {
      expect(next).to.have.been.calledOnce;
      expect(next).to.have.been.calledWith(error);
    });

    it('throws an error', () => {
      expect(next).to.returned(error);
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
      secretServiceStub.create.resolves(secret);
      res.json.returns(secret);

      const req = {
        body: {
          ...payload
        }
      };
      result = await secretController.create(req, res, next);
    });

    after(resetHistory);

    it('called secretServiceStub.create', () => {
      expect(secretServiceStub.create).to.have.been.calledOnce;
      expect(secretServiceStub.create).to.have.been.calledWith(payload);
    });

    it('called res.json', () => {
      expect(res.json).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledWith(secret);
    });

    it('returned result', () => {
      expect(result).to.equal(secret);
    });
  });

  context('create fails', () => {
    const payload = {
      secret: 'hello world',
      expireAfterViews: '10',
      expireAfter: 0
    };
    const error = new Error('test');
    before(async () => {
      next.returns(error);
      secretServiceStub.create.throws(error);
      const req = {
        body: {
          ...payload
        }
      };
      result = await secretController.create(req, res, next);
    });

    after(resetHistory);

    it('called next', () => {
      expect(next).to.have.been.calledOnce;
      expect(next).to.have.been.calledWith(error);
    });

    it('throws an error', () => {
      expect(next).to.returned(error);
    });
  });
});
