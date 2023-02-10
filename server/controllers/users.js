const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;
  const users = await User.find({});
  const usernames = users.map((user) => user.username);

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  if (usernames.includes(username)) {
    response
      .status(400)
      .json({ error: 'expected `username` to be unique' })
      .end();
  } else {
    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
  }
});

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    likes: 1,
    url: 1,
  });
  response.json(users);
});

module.exports = usersRouter;
