/* eslint-disable no-unused-expressions */
const chai = require('chai');
const chaiHttp = require('chai-http');
const MongoMemory = require('mongodb-memory-server').default;
const mongoose = require('mongoose');
const { expect } = require('chai');

const server = require('../../');

chai.use(chaiHttp);

let mongod;

describe('user tests', () => {
  before(async () => {
    mongod = new MongoMemory({ binary: { version: '4.0.0' } });
    return mongoose.connect(await mongod.getConnectionString(), {
      useNewUrlParser: true,
    });
  });

  describe('api', () => {
    it('should create an user', (done) => {
      chai.request(server)
        .post('/api/users/')
        .type('json')
        .send({ username: 'xpto', password: '123' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          done();
        });
    });

    it('should list created users', (done) => {
      chai.request(server)
        .get('/api/users')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf(1);
          done();
        });
    });

    it('should returns exception if username already exists', (done) => {
      chai.request(server)
        .post('/api/users/')
        .type('json')
        .send({ username: 'xpto', password: '123' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.contains('registered_user');
          //   exp;
          done();
        });
    });
  });
});
