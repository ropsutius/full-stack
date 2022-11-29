const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const api = supertest(app);

const initialUsers = [
  {
    name: 'Matti',
    username: 'matti123',
    passwordHash: bcrypt.hash('salasana456', 10),
  },
  {
    name: 'Teppo',
    username: 'Slayer69',
    passwordHash: bcrypt.hash('salasana123', 10),
  },
];

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('salasana123', 10);
  const user = new User({ username: 'Matti', passwordHash });

  await user.save();
});

test('get all users', async () => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 100000);

test('add new user', async () => {
  await api
    .post('/api/users')
    .send({
      name: 'Teppo',
      username: 'Slayer69',
      password: 'salasana123',
    })
    .expect(201);
}, 100000);

test('too short password', async () => {
  const response = await api
    .post('/api/users')
    .send({
      name: 'Teppo',
      username: 'Slayer69',
      password: '1',
    })
    .expect(400);
  expect(response.body.error).toContain(
    'Password must be at least 3 characters long'
  );
});

test('username already exists', async () => {
  const response = await api
    .post('/api/users')
    .send({
      name: 'Matti',
      username: 'Slayer69',
      password: 'salasana123',
    })
    .expect(400);
  expect(response.body.error).toContain('Username already taken');
});

test('username missing', async () => {
  const response = await api
    .post('/api/users')
    .send({
      name: 'Matti',
      password: 'salasana123',
    })
    .expect(400);
  expect(response.body.error).toContain(
    'User validation failed: username: Path `username` is required.'
  );
});

test('password missing', async () => {
  const response = await api
    .post('/api/users')
    .send({
      name: 'Matti',
      username: 'Slayer69',
    })
    .expect(400);

  expect(response.body.error).toContain('Password is required');
});

afterAll(() => {
  mongoose.connection.close();
});
