const express = require('express');
require('express-async-errors');
const cors = require('cors');

const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const { MONGODB_URI } = require('./utils/config');
const { errorHandler, tokenExtractor, logger } = require('./utils/middleware');

const app = express();
mongoose.connect(MONGODB_URI).catch((error) => next(error));

app.use(cors());
app.use(express.json());
app.use(logger);
app.use(tokenExtractor);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(errorHandler);

module.exports = app;
