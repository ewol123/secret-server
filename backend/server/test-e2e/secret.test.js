const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## Secret APIs', () => {
  const hashes = [];
  const payloadWithExpire = {
    secret: 'my secret',
    expireAfterViews: 10,
    expireAfter: 1,
  };

  const payloadWithoutExpire = {
    secret: 'my another secret',
    expireAfterViews: '20',
    expireAfter: 0,
  };

  describe('# POST /api/secret', () => {
    it('should create a new secret with expiry date', (done) => {
      request(app)
        .post('/api/secret')
        .send(payloadWithExpire)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.hash).to.be.a('string');
          expect(res.body.secretText).to.equal(payloadWithExpire.secret);
          expect(res.body.createdAt).to.be.a('string');
          expect(res.body.expiresAt).to.be.a('string');
          expect(res.body.remainingViews).to.equal(payloadWithExpire.expireAfterViews);
          hashes.push(res.body.hash);
          done();
        })
        .catch(done);
    });
    it('should create a new secret without expiry date', (done) => {
      request(app)
        .post('/api/secret')
        .send(payloadWithoutExpire)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.hash).to.be.a('string');
          expect(res.body.secretText).to.equal(payloadWithoutExpire.secret);
          expect(res.body.createdAt).to.be.a('string');
          expect(res.body.expiresAt).to.equal(null);
          expect(res.body.remainingViews.toString())
          .to.equal(payloadWithoutExpire.expireAfterViews);
          hashes.push(res.body.hash);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Bad Request, when payload is incorrect', (done) => {
      request(app)
      .post('/api/secret')
      .send({ ...payloadWithoutExpire, expireAfterViews: 'hello' })
      .expect(httpStatus.BAD_REQUEST)
      .then(() => {
        done();
      })
      .catch(done);
    });
  });

  describe('# GET /api/secret/:hash', () => {
    it('should get secret details', (done) => {
      request(app)
        .get(`/api/secret/${hashes[0]}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.hash).to.be.a('string');
          expect(res.body.secretText).to.equal(payloadWithExpire.secret);
          expect(res.body.createdAt).to.be.a('string');
          expect(res.body.expiresAt).to.be.a('string');
          expect(res.body.remainingViews).to.equal(payloadWithExpire.expireAfterViews - 1);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when secret does not exists', (done) => {
      request(app)
        .get('/api/secret/738507B')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
    it('should report error with message - Bad Request, when params are incorrect', (done) => {
      request(app)
      .get('/api/secret/hello_world')
      .expect(httpStatus.BAD_REQUEST)
      .then(() => {
        done();
      })
      .catch(done);
    });
  });
});

