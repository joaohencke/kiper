const express = require('express');
const userManager = require('../');

const readRouter = express.Router({ mergeParams: true });

module.exports = readRouter;

readRouter.get('/', (req, res, next) => {
  userManager
    .list()
    .then(users => res.json(users))
    .catch(next);
});
