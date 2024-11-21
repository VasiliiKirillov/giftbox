import axios from 'axios';
import { handle401 } from './utils';

export const BASE = 'https://dev.bitmakers.me/api/admin';

const instance = axios.create({
  baseURL: BASE,
});

instance.interceptors.request.use(function (config) {
  config.headers.Authorization = `Bearer ${window.localStorage.getItem('JWT')}`;

  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      return handle401(originalRequest);
    } else {
      return Promise.reject(error);
    }
  }
);

export default instance;
