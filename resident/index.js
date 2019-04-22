const ResidentModel = require('./model');

/**
 * Creates a new resident
 * @param {Object} entity
 * @param {String} entity.name
 * @param {String} entity.email
 * @param {String} entity.cpf
 * @param {Number} entity.apartment
 * @param {String} entity.block
 * @returns {Promise<Object>} created Resident
 */
exports.create = async ({
  name, email, cpf, apartment, block,
}) => {
  const resident = new ResidentModel({
    name, email, cpf, apartment, block,
  });

  await resident.save();

  return resident.toObject();
};

/**
 * Updates a saved resident
 * @param {Object} entity
 * @param {Object} entity.id
 * @param {String} entity.name
 * @param {String} entity.email
 * @param {String} entity.cpf
 * @param {Number} entity.apartment
 * @param {String} entity.block
 * @returns {Promise<Object>} updated resident
 */
exports.update = ({
  id, name, email, cpf, apartment, block,
}) => {
  const $set = {};

  if (name) $set.name = name;
  if (email) $set.email = email;
  if (cpf) $set.cpf = cpf;
  if (apartment) $set.apartment = apartment;
  if (block) $set.block = block;

  if (Object.keys($set).length) return ResidentModel.findByIdAndUpdate(id, { $set }, { new: true });

  return ResidentModel.findById(id);
};

/**
 * List residents and filter when it needs.
 * @param {Object} filter
 * @param {Object} filter.id
 * @param {String} filter.name
 * @param {String} filter.email
 * @param {String} filter.cpf
 * @param {Number} filter.apartment
 * @param {String} filter.block
 * @param {Number} filter.page
 * @param {Number} filter.limit
 * @returns {Promise<Array>}
 */
exports.list = ({
  name, email, cpf, apartment, block, page, limit = 30,
}) => {
  const query = {};

  const regex = val => ({ $regex: val, $options: 'i' });

  if (name) query.name = regex(name);
  if (email) query.email = regex(email);
  if (cpf) query.cpf = regex(cpf);
  if (apartment) query.apartment = apartment;
  if (block) query.block = block;

  let command = ResidentModel.find(query).lean();

  if (page) {
    command = command.limit(Number(limit)).skip((Number(page) - 1) * Number(limit));
  }

  return command.exec();
};

/**
 * Remove a resident by it's id
 * @param {Object} entity
 * @param {Object} entity.id
 * @returns {Promise}
 */
exports.remove = ({ id }) => ResidentModel.findByIdAndDelete(id);
