const _ = require('lodash');

const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  let total = 0;

  blogs.forEach((blog) => (total += blog.likes));

  return total;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return [];
  }

  const likesArray = [];
  blogs.map((blog) => likesArray.push(blog.likes));
  const maximumLikes = Math.max(...likesArray);
  const index = likesArray.indexOf(maximumLikes);

  return blogs[index];
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return [];
  }

  const groups = _.groupBy(blogs, 'author');
  const allBlogs = [];
  const allAuthors = Object.keys(groups);
  for (let group in groups) {
    allBlogs.push(groups[group].length);
  }
  const maxBlogs = Math.max(...allBlogs);
  const index = allBlogs.indexOf(maxBlogs);

  return { author: allAuthors[index], blogs: maxBlogs };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return [];
  }

  const groups = _.groupBy(blogs, 'author');
  const allLikes = [];
  const allAuthors = Object.keys(groups);
  for (let group in groups) {
    allLikes.push(
      groups[group].reduce((acc, author) => (acc += author.likes), 0)
    );
  }
  const maxLikes = Math.max(...allLikes);
  const index = allLikes.indexOf(maxLikes);

  return { author: allAuthors[index], likes: maxLikes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
