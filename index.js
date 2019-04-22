const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');

const config = require('./__config');

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

app.listen(config.port, () => console.log(`express litening on ${config.port}`));
