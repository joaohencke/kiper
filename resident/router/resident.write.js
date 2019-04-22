const express = require('express');
const { validate, struct } = require('../../utils/validation');
const manager = require('../');

const writeRouter = express.Router({ mergeParams: true });

module.exports = writeRouter;

writeRouter.post('/',
  validate({
    name: 'string',
    email: 'string & email',
    cpf: struct.optional('cpf'),
    apartment: 'numeric',
    block: struct.enum(['A', 'B', 'C']),
  }, 'body'),
  (req, res, next) => {
    manager.create(req.validData)
      .then(entity => res.status(201).json(entity))
      .catch(next);
  });

writeRouter.put('/:id',
  validate({
    id: 'string',
    name: 'string',
    email: 'string',
    cpf: struct.optional('string'),
    apartment: 'numeric',
    block: struct.enum(['A', 'B', 'C']),
  }),
  (req, res, next) => {
    manager.update(req.validData)
      .then(entity => res.json(entity))
      .catch(next);
  });

writeRouter.delete('/:id',
  validate({ id: 'string' }),
  (req, res, next) => {
    manager.remove(req.validData)
      .then(() => res.status(204).end())
      .catch(next);
  });
