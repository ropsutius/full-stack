import axios from 'axios';
const baseUrl = '/api/blogs';

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((res) => {
    console.log(res.data);
    return res.data;
  });
};

const blogService = { getAll };
export default blogService;
