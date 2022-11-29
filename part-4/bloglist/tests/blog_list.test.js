const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  {
    title: '1st blog post',
    author: 'Author 1',
    url: 'www.com',
    likes: 10,
  },
  {
    title: '2nd blog post',
    author: 'Author 2',
    url: 'www.fi',
    likes: 15,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  for (blog of initialBlogs) {
    await new Blog(blog).save();
  }
});

test('blogs return as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 100000);

test('get all blogs', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(initialBlogs.length);
}, 100000);

test('blogs have attribute id', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body[0].id).toBeDefined();
}, 100000);

test('post a blog', async () => {
  const newBlog = {
    title: 'new blog post',
    author: 'New Author',
    url: 'www.fi',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');

  const titles = response.body.map((r) => r.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(titles).toContain('new blog post');
}, 100000);

test('post a blog with missing likes', async () => {
  const newBlog = {
    title: 'new blog post',
    author: 'New Author',
    url: 'www.fi',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');

  const likes = response.body.map((r) => r.likes);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(likes).toContain(0);
}, 100000);

test('post a blog with missing title and url', async () => {
  const newBlog = {
    author: 'new Author',
    likes: 5,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);
}, 100000);

test('delete existing blog', async () => {
  let blogs = await api.get('/api/blogs');
  const url = '/api/blogs/' + blogs.body[0].id;

  await api.delete(url).expect(204);

  blogs = await api.get('/api/blogs');
  expect(blogs.body).toHaveLength(initialBlogs.length - 1);
}, 100000);

test('delete faulty id', async () => {
  const url = '/api/blogs/' + 'faulty_id';

  await api.delete(url).expect(400);
}, 100000);

test('delete an already deleted blog', async () => {
  let blogs = await api.get('/api/blogs');
  const url = '/api/blogs/' + blogs.body[0].id;

  await api.delete(url).expect(204);
  await api.delete(url).expect(404);
}, 100000);

test('update an existing blog', async () => {
  let blogs = await api.get('/api/blogs');
  const url = '/api/blogs/' + blogs.body[0].id;

  await api.put(url).send({ likes: 200 }).expect(200);

  blogs = await api.get('/api/blogs');
  const likes = blogs.body.map((r) => r.likes);

  expect(likes).toContain(200);
}, 100000);

afterAll(() => {
  mongoose.connection.close();
});
