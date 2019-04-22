/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 12;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

/**
 * Hash user's password
 * @param {String} password to be hashed
 * @returns {Promise<String>} hashed password
 */
UserSchema.statics.hashPassword = password => bcrypt.hash(password, saltRounds);

/**
 * Check if password if valid
 * @param {String} password user's password
 * @returns {Promise<Boolean>} matched ?
 */
UserSchema.methods.checkPassword = async function checkPassword(password) {
  return bcrypt.compare(password, this.password);
};

/**
 * Validate unique username
 * @param {String} username
 * @returns {Promise<Boolean>} has another with?
 * @throws {Error} registered_user
 */
UserSchema.path('username').validate(async function usernameValidation(username) {
  const count = await UserModel.countDocuments({ username, _id: { $ne: this._id } });
  return !count;
}, 'registered_user');

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
