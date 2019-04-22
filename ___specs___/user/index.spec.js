const MongoMemory = require('mongodb-memory-server').default;
const mongoose = require('mongoose');
const { expect } = require('chai');
const userManager = require('../../user');

let mongod;

describe('user tests', () => {
  before(async () => {
    mongod = new MongoMemory({ binary: { version: '4.0.0' } });
    return mongoose.connect(await mongod.getConnectionString(), {
      useNewUrlParser: true,
    });
  });

  describe('manager', () => {
    it('should create an user', async () => {
      const user = await userManager.create({ username: 'test', password: '123123' });

      expect(user).to.have.property('_id');
      expect(user.password).to.be.undefined; //eslint-disable-line
      return true;
    });

    it('should list created users', async () => {
      const users = await userManager.list();

      expect(users).to.have.lengthOf(1);

      return true;
    });

    it('should throw exception if username already exists', async () => {
      try {
        const user = await userManager.create({ username: 'test', password: '123123' });
        return user;
      } catch (e) {
        expect(e.message).to.contains('registered_user');
        return e;
      }
    });
  });
});
