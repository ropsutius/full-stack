const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const User = require('../models/user');

morgan.token('blog', (req) => {
  if (
    req.body &&
    Object.keys(req.body).length === 0 &&
    Object.getPrototypeOf(req.body) === Object.prototype
  )
    return '';
  else return JSON.stringify(req.body);
});
const s = `:method :url :status :res[content-length] - :response-time ms :blog`;
const logger = morgan(s);

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError')
    return res.status(400).send({ error: 'malformatted id' });
  else if (error.name === 'ValidationError')
    return res.status(400).json({ error: error.message });
  else if (error.code === 11000)
    return res.status(400).json({ error: 'Username already taken' });
  else if (error.name === 'JsonWebTokenError')
    return res.status(401).json({ error: 'Invalid token' });

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer '))
    req.token = auth.substring(7);
  else req.token = null;

  next();
};

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) return res.status(401).json({ error: 'Invalid token' });

  req.user = await User.findById(decodedToken.id);
  next();
};

module.exports = { logger, errorHandler, tokenExtractor, userExtractor };
