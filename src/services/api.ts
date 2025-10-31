import { create } from 'apisauce';

const api = create({
  baseURL: 'https://api.chucknorris.io/jokes',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
