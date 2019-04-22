const oauth = require('./oauth');

/**
 * Authentication midddleware wrapper
 */
exports.authenticate = () => oauth.authenticate();
