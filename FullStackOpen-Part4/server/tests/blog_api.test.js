const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const Blog = require('../models/blog');
const bcrypt = require('bcrypt');
const User = require('../models/user');
let token;
let id;

describe('Blogs', () => {
  beforeAll(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
    await User.deleteMany({});
    const passwordHash = bcrypt.hashSync('secret', 10);
    const user = new User({
      username: 'root',
      passwordHash,
    });
    await user.save();
  }, 10000);

  afterAll(() => {
    mongoose.disconnect();
  });

  describe('POST/login', () => {
    test('authenticate user', async () => {
      const user = {
        username: 'root',
        password: 'secret',
      };

      const res = await api.post('/api/login').send(user).expect(201);
      token = res.body.token;
    });
  });

  describe('GET/blogs', () => {
    test('blogs are returned as json', async () => {
      const res = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(res.body).toHaveLength(helper.initialBlogs.length);
    });

    test('get all blogs', async () => {
      const response = await api.get('/api/blogs').expect(200);

      expect(response.body).toHaveLength(helper.initialBlogs.length);
    });

    test('a specific blog is within the returned blogs', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const contents = response.body.map((blog) => blog.title);

      expect(contents).toContain('React patterns');
    });

    test('unique identifier property is named id and it exist', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body[0].id).toBeDefined();
    });
  });

  describe('GET/blogs/:id', () => {
    test('returns the correct blog', async () => {
      const blogs = await helper.blogsInDb();
      const blog = blogs[0];

      const resultBlog = await api
        .get(`/api/blogs/${blog.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(resultBlog.body).toEqual(blog);
    });

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId();
      await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
    });

    test('fails with status code 400 when id is invalid', async () => {
      const invalidId = '63d3ef49095a900fa48edf7';

      const res = await api.get(`/api/blogs/${invalidId}`);

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toContain('invalid id');
    });
  });

  describe('PUT/blogs/:id', () => {
    test('updates the likes', async () => {
      const blogs = await helper.blogsInDb();
      const blog = blogs[0];
      const updatedBlog = {
        ...blog,
        likes: 20,
      };

      await api.put(`/api/blogs/${blog.id}`).send(updatedBlog).expect(200);

      const newList = await helper.blogsInDb();
      expect(newList[0].likes).toBe(20);
    });
  });

  describe('POST/blogs', () => {
    test('it should save new blog to db', async () => {
      const newBlog = {
        title: 'Computer Science',
        author: 'Jane Doe',
        url: 'https://example2.com',
        likes: 15,
      };

      const res = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

      id = res.body.id;
    });

    test("if the likes property doesn't exist it defaults to the value 0", async () => {
      const newBlog = {
        title: 'Computers',
        author: 'John Doe',
        url: 'https://example2.com',
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogs = await helper.blogsInDb();

      expect(blogs[blogs.length - 1].likes).toBe(0);
    });
  });

  describe('DELETE/blogs/:id', () => {
    test('a blog can be deleted', async () => {
      await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      const titles = blogsAtEnd.map((b) => b.title);
      expect(titles).not.toContain('Computer Science');
    });
  });
});
