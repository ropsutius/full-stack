const blog = require('../models/blog');
const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let sum = 0;
  for (const blog of blogs) {
    sum += blog.likes;
  }
  return sum;
};

const favoriteBlog = (blogs) => {
  let topLikes = 0;
  let topBlog = {};

  for (const blog of blogs) {
    if (topLikes < blog.likes) {
      topLikes = blog.likes;
      topBlog = blog;
    }
  }
  return topBlog;
};

const mostBlogs = (blogs) => {
  let result = _.map(_.countBy(blogs, 'author'), (val, key) => ({
    author: key,
    blogs: val,
  }));
  result = _.maxBy(result, 'blogs');

  if (result) return result;
  else return {};
};

const mostLikes = (blogs) => {
  let result = _.map(_.groupBy(blogs, 'author'), (val, key) => ({
    author: key,
    likes: _.sumBy(val, 'likes'),
  }));
  result = _.maxBy(result, 'likes');

  if (result) return result;
  else return {};
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
