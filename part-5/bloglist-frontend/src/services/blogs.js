import axios from 'axios';
const baseUrl = '/api/blogs/';

let token = null;
const config = {
  headers: {
    Authorization: token,
  },
};

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
  config.headers.Authorization = token;
};

const getAll = async () => {
  const res = await axios.get(baseUrl);
  return res.data;
};

const addBlog = async (blog) => {
  const res = await axios.post(baseUrl, blog, config);
  return res.data;
};

const updateBlog = async (blog) => {
  const url = baseUrl + blog.id;
  const res = await axios.put(url, blog, config);
  return res.data;
};

const removeBlog = async (blog) => {
  const url = baseUrl + blog.id;
  await axios.delete(url, config);
};

const blogService = { getAll, addBlog, updateBlog, removeBlog, setToken };
export default blogService;
