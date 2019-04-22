const express = require('express');
const { validate, struct } = require('../../utils/validation');
const manager = require('../');

const readRouter = express.Router({ mergeParams: true });

module.exports = readRouter;

readRouter.get('/',
  validate({
    name: struct.optional('string'),
    email: struct.optional('string'),
    cpf: struct.optional('string'),
    apartment: struct.optional('numeric'),
    block: struct.optional(struct.enum(['A', 'B', 'C'])),
    page: struct.optional('numeric'),
    limit: struct.optional('numeric'),
  }, 'query'),
  (req, res, next) => {
    manager.list(req.validData)
      .then(entities => res.json(entities))
      .catch(next);
  });
