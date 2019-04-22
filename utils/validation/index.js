const { superstruct } = require('superstruct');
const Boom = require('boom');

const { handler } = require('../error');

/**
 * superstruct declaration with custom types
 */
exports.struct = superstruct({
  types: {
    numeric: (v) => {
      if (Number.isNaN(v)) return 'invalid_number';

      return true;
    },
    email: v => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v),
    cpf: (v) => {
      if (!v || v.length !== 11) return 'invalid_cpf';

      let sum = 0;
      let remain;

      for (let i = 1; i <= 9; i += 1) sum += parseInt(v.substring(i - 1, i), 10) * (11 - i);

      remain = (sum * 10) % 11;

      if (remain === 10 || remain === 11) remain = 0;

      if (remain !== parseInt(v.substring(9, 10), 10)) return 'invalid_cpf';

      sum = 0;

      for (let i = 1; i <= 10; i += 1) sum += parseInt(v.substring(i - 1, i), 10) * (12 - i);

      remain = (sum * 10) % 11;
      if (remain === 10 || remain === 11) remain = 0;
      if (remain !== parseInt(v.substring(10, 11), 10)) return 'invalid_cpf';

      return true;
    },
  },
});

/**
 * Format struct error's message
 *
 * @param {Object} error
 * @returns {String} formatted message
 */
exports.formatMessage = (error) => {
  let errMessage = `${error.message}`;
  if (error.reason) errMessage += ` - ${error.reason}`;
  if (errMessage.length > 250) {
    errMessage = `${errMessage.slice(0, 150)} ... ${errMessage.slice(errMessage.length - 100, errMessage.length)}`;
  }
  return errMessage;
};

/**
 * Validate parameters from a Request path based on a Schema
 *
 * @param {Object} schema struct schema object
 * @param {String} path request path to validate - if none, will get from query, params and body
 * (the priority order is inverse)
 */
exports.validate = (schema, path) => (req, res, next) => {
  try {
    const Schema = exports.struct.partial(schema);

    let args;

    if (path) args = { ...req[path] };
    else args = { ...req.query, ...req.params, ...req.body };

    req.validData = {
      ...req.validData,
      ...Schema(args),
    };

    return next();
  } catch (e) {
    return handler(res, Boom.badRequest(exports.formatMessage(e)));
  }
};
