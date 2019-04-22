const express = require('express');
const oauth = require('../oauth');

const writeRouter = express.Router({ mergeParams: true });

module.exports = writeRouter;

writeRouter.post(
  '/token',
  (req, res, next) => {
    if (req.is('json')) req.headers['content-type'] = 'application/x-www-form-urlencoded';
    next();
  },
  oauth.token({ /* accessTokenLifetime: 5, */ requireClientAuthorization: { password: false, refresh_token: false } }), // Remove comment to test the token refetch on front end
);

writeRouter.post('/revoke', oauth.authenticate(), oauth.Class.revoke());
