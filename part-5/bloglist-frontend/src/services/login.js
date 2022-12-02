import axios from 'axios';
const baseUrl = '/api/login';

const login = async (creds) => {
  const res = await axios.post(baseUrl, creds);
  return res.data;
};

const loginService = { login };
export default loginService;
