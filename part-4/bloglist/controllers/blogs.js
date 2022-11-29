const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (req, res) => {
  res.json(
    await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  );
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) res.json(blog);
  else res.status(404).json({ error: 'blog not found' });
});

blogsRouter.post('/', userExtractor, async (req, res) => {
  const user = req.user;

  const blog = new Blog(req.body);
  blog.user = user._id;

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (req.user.id.toString() !== blog.user.toString())
    return res.status(401).json({ error: 'Invalid token' });

  await blog.remove();
  res.status(204).end();
});

blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body;

  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { likes },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  );

  if (blog) res.json(blog);
  else res.status(404).json({ error: 'blog not found' });
});

module.exports = blogsRouter;
