const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const blog = require('../models/blog');

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

const initialUser = {
  username: 'Matti123',
  name: 'Matti Saari',
  password: 'password123',
};

const loginUser = async (user) => {
  const res = await api.post('/api/login').send(user).expect(200);
  return res.body.token;
};

describe('Test with two blogs initially saved under one user', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const user = await new User({
      username: initialUser.username,
      name: initialUser.name,
      passwordHash: await bcrypt.hash(initialUser.password, 10),
    }).save();

    for (const blog of initialBlogs) {
      blog.user = user._id;
      await new Blog(blog).save();
    }
  });

  test('Initial blogs return as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 100000);

  test('Get all blogs returns 2 blogs', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length);
  }, 100000);

  test('Get all blogs returns blogs that have attribute id', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  }, 100000);

  test('Get a blog by a specific id returns the correct blog', async () => {
    const res = await api.get('/api/blogs');
    const title = res.body[0].title;

    const blog = await api.get('/api/blogs/' + res.body[0].id).expect(200);
    expect(blog.body.title).toBe(title);
  }, 100000);

  test('Login and delete an existing blog', async () => {
    const token = await loginUser(initialUser);
    let blogs = await api.get('/api/blogs');
    const url = '/api/blogs/' + blogs.body[0].id;

    await api
      .delete(url)
      .set('Authorization', 'bearer ' + token)
      .expect(204);

    blogs = await api.get('/api/blogs');
    expect(blogs.body).toHaveLength(initialBlogs.length - 1);
  }, 100000);

  test('Login and attempt to delete a blog with a faulty id', async () => {
    const token = await loginUser(initialUser);
    const url = '/api/blogs/' + 'faulty_id';

    const res = await api
      .delete(url)
      .set('Authorization', 'bearer ' + token)
      .expect(400);
    expect(res.body.error).toBe('malformatted id');
  }, 100000);

  test('Login and attempt to delete an already deleted blog', async () => {
    const token = await loginUser(initialUser);
    let blogs = await api.get('/api/blogs');
    const url = '/api/blogs/' + blogs.body[0].id;

    await api
      .delete(url)
      .set('Authorization', 'bearer ' + token)
      .expect(204);
    const res = await api
      .delete(url)
      .set('Authorization', 'bearer ' + token)
      .expect(404);
    expect(res.body.error).toBe('Blog not found');
  }, 100000);

  test('update an existing blog', async () => {
    let blogs = await api.get('/api/blogs');
    const url = '/api/blogs/' + blogs.body[0].id;

    await api.put(url).send({ likes: 200 }).expect(200);

    blogs = await api.get('/api/blogs');
    const likes = blogs.body.map((r) => r.likes);

    expect(likes).toContain(200);
  }, 100000);
});

describe('Test with no blogs initially saved under one user', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    await new User({
      username: initialUser.username,
      name: initialUser.name,
      passwordHash: await bcrypt.hash(initialUser.password, 10),
    }).save();
  });

  test('Attempt to post without logging in', async () => {
    const newBlog = {
      title: 'New blog post',
      author: 'New Author',
      url: 'www.fi',
      likes: 0,
    };

    const res = await api.post('/api/blogs').send(newBlog).expect(401);
    expect(res.body.error).toBe('Invalid token');
  });

  test('Login and post a blog', async () => {
    const token = await loginUser(initialUser);
    const newBlog = {
      title: 'New blog post',
      author: 'New Author',
      url: 'www.fi',
      likes: 0,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const res = await api.get('/api/blogs');
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('New blog post');
  }, 100000);

  test('Login and post a blog with missing likes', async () => {
    const token = await loginUser(initialUser);
    const newBlog = {
      title: 'new blog post',
      author: 'New Author',
      url: 'www.fi',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const res = await api.get('/api/blogs');
    expect(res.body).toHaveLength(1);
    expect(res.body[0].likes).toBe(0);
  }, 100000);

  test('Login and post a blog with missing title', async () => {
    const token = await loginUser(initialUser);
    const newBlog = {
      author: 'new Author',
      url: 'www.fi',
      likes: 5,
    };

    const res = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlog)
      .expect(400);
    expect(res.body.error).toBe(
      'Blog validation failed: title: Path `title` is required.'
    );
  }, 100000);

  test('Login and post a blog with missing url', async () => {
    const token = await loginUser(initialUser);
    const newBlog = {
      title: 'new blog post',
      author: 'new Author',
      likes: 5,
    };

    const res = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlog)
      .expect(400);
    expect(res.body.error).toBe(
      'Blog validation failed: url: Path `url` is required.'
    );
  }, 100000);
});

afterAll(() => {
  mongoose.connection.close();
});
