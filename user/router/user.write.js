const express = require('express');

const { validate } = require('../../utils/validation');
const userManager = require('../');

const writeRouter = express.Router({ mergeParams: true });

module.exports = writeRouter;

writeRouter.post(
  '/',
  validate(
    {
      username: 'string',
      password: 'string',
    },
    'body',
  ),
  (req, res, next) => {
    userManager
      .create(req.validData)
      .then(user => res.status(201).json(user))
      .catch(next);
  },
);
