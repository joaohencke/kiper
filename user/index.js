const Boom = require('boom');
const UserModel = require('./model');
/**
 * Creates an user
 * @param {Object} user
 * @param {String} user.username
 * @param {String} user.password
 *
 * @returns {Promise<Object>} created user
 */
exports.create = async ({ username, password }) => {
  const user = new UserModel({
    username,
    password: await UserModel.hashPassword(password),
  });

  await user.save();

  return { ...user.toObject(), password: undefined };
};

/**
 * Lists all users stored in db
 * @returns {Promise<Array>} array of users
 */
exports.list = async () => UserModel.find({});

/**
 * Check if user's password match
 * @param {Object} user
 * @param {String} user.username
 * @param {String} user.password
 *
 * @returns {Promise<Object>} matched user
 */
exports.getByPassword = async ({ username, password }) => {
  const user = await UserModel.findOne({ username }).select('+password');

  if (!user) throw Boom.badRequest('invalid_password');

  const match = await user.checkPassword(password);

  if (match) return { ...user.toObject(), password: undefined };

  throw Boom.badRequest('invalid_password');
};
