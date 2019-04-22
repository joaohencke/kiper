const { Request, Response } = require('oauth2-server');
const UnauthorizedRequestError = require('oauth2-server/lib/errors/unauthorized-request-error');
const OAuthServer = require('oauth2-server');
const OAuthModel = require('./model');

class OAuth {
  constructor({ model, continueMiddleware, useErrorHandler }) {
    if (!model) throw new Error('model needed');
    this.continueMiddleware = continueMiddleware;
    this.useErrorHandler = useErrorHandler;

    this.server = new OAuthServer({ model });
  }

  static _handleSuccess(res, response) {
    if (res.status === 302) {
      const { location } = response.headers;
      delete response.headers.location;
      res.set(response.headers);
      return res.redirect(location);
    }

    res.set(response.headers);
    return res.status(response.status).send(response.body);
  }

  static _handleError(e, res, response, next) {
    if (this.useErrorHandler) return next();

    if (response) res.set(response.headers);
    res.status(e.code);
    if (e instanceof UnauthorizedRequestError) return res.send();

    return res.send({ error: e.name, error_description: e.message });
  }

  authenticate(options) {
    return async (req, res, next) => {
      const request = new Request(req);
      const response = new Response(res);
      try {
        const token = await this.server.authenticate(request, response, options);
        res.locals.oauth = { token };
        req.user = token.user;
        return next();
      } catch (e) {
        return OAuth._handleError(e, res, response, next);
      }
    };
  }

  authorize(options) {
    return async (req, res, next) => {
      const request = new Request(req);
      const response = new Response(res);

      try {
        const code = await this.server.authorize(request, response, options);

        res.locals.oauth = { code };
        if (this.continueMiddleware) next();
        return OAuth._handleSuccess(res, response);
      } catch (e) {
        return OAuth._handleError(e, res, response, next);
      }
    };
  }

  token(options) {
    return async (req, res, next) => {
      const request = new Request(req);
      const response = new Response(res);

      try {
        const token = await this.server.token(request, response, options);
        res.locals.oauth = { token };
        req.user = token.user;
        if (this.continueMiddleware) next();

        return OAuth._handleSuccess(res, response);
      } catch (e) {
        return OAuth._handleError(e, res, response, next);
      }
    };
  }

  static revoke() {
    return async (req, res, next) => {
      await OAuthModel.db.findByIdAndDelete(res.locals.oauth.token._id);
      res.json('success');
      next();
    };
  }
}

const oauth = new OAuth({ model: OAuthModel, continueMiddleware: false, debug: true });

module.exports = oauth;

module.exports.Class = OAuth;
