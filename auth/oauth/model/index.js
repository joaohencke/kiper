const OAuthModel = require('./OAuthModel');
const { clientId: CLIENT_ID, clientSecret: CLIENT_SECRET } = require('../../../__config');
const userManager = require('../../../user/');

exports.getClient = () => ({ id: CLIENT_ID, grants: ['password', 'refresh_token'], client_secret: CLIENT_SECRET });

function format({
  token, type, expiresAt, userId,
}) {
  const maps = {
    refresh_token: {
      expiresAt: 'refreshTokenExpiresAt',
      token: 'refreshToken',
    },
    access_token: {
      expiresAt: 'accessTokenExpiresAt',
      token: 'accessToken',
    },
  };

  const formatted = { client: { id: CLIENT_ID }, user: { id: userId } };

  formatted[maps[type].expiresAt] = expiresAt;
  formatted[maps[type].token] = token;

  return formatted;
}

async function get({ accessToken, refreshToken }) {
  const query = { token: accessToken || refreshToken, type: accessToken ? 'access_token' : 'refresh_token' };

  const token = await OAuthModel.findOne(query)
    .populate('user')
    .lean();

  if (!token) return null;

  return format(token);
}

exports.getAccessToken = accessToken => get({ accessToken });

exports.getRefreshToken = refreshToken => get({ refreshToken });

exports.getUser = (username, password) => userManager.getByPassword({ password, username });

exports.saveToken = async (token, client, user) => {
  const accessToken = new OAuthModel({
    token: token.accessToken,
    expiresAt: token.accessTokenExpiresAt,
    type: 'access_token',
    clientId: CLIENT_ID,
    userId: user._id, //eslint-disable-line
  });

  const refreshToken = new OAuthModel({
    token: token.refreshToken,
    expiresAt: token.refreshTokenExpiresAt,
    type: 'refresh_token',
    clientId: CLIENT_ID,
    userId: user._id, //eslint-disable-line
  });

  await Promise.all([accessToken.save(), refreshToken.save()]);

  return { ...format(accessToken.toObject()), ...format(refreshToken.toObject()) };
};

exports.revokeToken = async (token) => {
  const result = await OAuthModel.remove({ token: token.refreshToken, type: 'refresh_token' });
  return !!result.n;
};

exports.db = OAuthModel;
