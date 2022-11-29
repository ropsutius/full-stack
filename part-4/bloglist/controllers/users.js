const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
  res.json(
    await User.find({}).populate('blogs', {
      url: 1,
      title: 1,
      author: 1,
      id: 1,
    })
  );
});

usersRouter.post('/', async (req, res, next) => {
  const { username, name, password } = req.body;

  if (!password)
    next({
      name: 'ValidationError',
      message: 'Password is required',
    });
  else if (password.length < 3)
    next({
      name: 'ValidationError',
      message: 'Password must be at least 3 characters long',
    });

  const passwordHash = await bcrypt.hash(password, 10);

  res.status(201).json(
    await new User({
      username,
      name,
      passwordHash,
    }).save()
  );
});

module.exports = usersRouter;
