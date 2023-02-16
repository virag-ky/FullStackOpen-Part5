const blogListRouter = require('express').Router();
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

// Get all blogs
blogListRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

// Create new blog
blogListRouter.post('/', userExtractor, async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const user = request.user;

  const blog = new Blog({
    ...request.body,
    user: user._id,
  });

  if (!(blog.title && blog.author && blog.url)) {
    response
      .status(400)
      .json({ error: 'title, author, and url are required' })
      .end();
  }

  if (!blog.likes) {
    blog.likes = 0;
  }

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();

  response.status(201).json(savedBlog);
});

// Update a blog
blogListRouter.put('/:id', async (request, response) => {
  const id = request.params.id;

  const updatedBlog = {
    ...request.body,
  };

  const result = await Blog.findByIdAndUpdate(id, updatedBlog, {
    new: true,
  });

  response.json(result);
});

// Get by ID
blogListRouter.get('/:id', async (request, response) => {
  const id = request.params.id;

  if (id.length !== 24) {
    response.status(400).json({ error: 'invalid id' }).end();
  } else {
    const blog = await Blog.findById(id);

    if (!blog) {
      response.status(404).end();
    } else {
      response.json(blog);
    }
  }
});

// Delete a blog
blogListRouter.delete('/:id', userExtractor, async (request, response) => {
  const id = request.params.id;
  await Blog.findByIdAndRemove(id);
  response.status(204).end();
});

module.exports = blogListRouter;
