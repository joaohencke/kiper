const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { handler } = require('./utils/error');
const config = require('./__config');
const apis = require('./_apis');

mongoose.connect(config.db, { useNewUrlParser: true, config: { autoIndex: true } });

const db = mongoose.connection;

db.on('error', () => {
  throw new Error(`Unable to connect db at ${config.db}`);
});


const app = express();

app.use(helmet());

app.use(
  express.json({
    limit: '5mb',
    type: 'application/json',
  }),
);

if (config.dev) app.use(morgan('dev'));

Object.keys(apis).forEach((apiName) => {
  app.use(`/api/${apiName}`, apis[apiName]);
});

app.use((err, req, res, next) => handler(res, err));

app.listen(config.port, () => console.log(`express litening on ${config.port}`));
