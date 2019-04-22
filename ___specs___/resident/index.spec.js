const MongoMemory = require('mongodb-memory-server').default;
const mongoose = require('mongoose');
const { expect } = require('chai');
const manager = require('../../resident');

let mongod;

describe('resident tests', () => {
  before(async () => {
    mongod = new MongoMemory({ binary: { version: '4.0.0' } });
    return mongoose.connect(await mongod.getConnectionString(), {
      useNewUrlParser: true,
    });
  });

  describe('manager', () => {
    it('should create a resident', async () => {
      const resident = await manager.create({
        name: 'Ygor', email: 'ygor@kiper.com.br', apartment: 101, block: 'A',
      });

      expect(resident).to.have.property('_id');
      return true;
    });

    it('should create a resident with cpf', async () => {
      const resident = await manager.create({
        name: 'Ygor', email: 'ygor@kiper.com.br', apartment: 101, block: 'A', cpf: '04678444963',
      });

      expect(resident).to.have.property('_id');
      expect(resident).to.have.property('cpf');

      return true;
    });

    it('should throw error because of invalid block', async () => {
      try {
        const resident = await manager.create({
          name: 'Ygor', email: 'ygor@kiper.com.br', apartment: 101, block: 'E', cpf: '04678444963',
        });
        return resident;
      } catch (e) {
        expect(e.message).to.contains('not a valid enum value for path `block`');
        return true;
      }
    });

    it('should limit results by 1', async () => {
      const residents = await manager.list({ page: 1, limit: 1 });
      expect(residents).to.have.lengthOf(1);
      return true;
    });
  });
});
