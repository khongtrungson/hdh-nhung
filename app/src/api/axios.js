import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../utils/constants';

let _token = null;
let _onUnauthorized = null;

export const setAuthToken = (token) => { _token = token; };
export const clearAuthToken = () => { _token = null; };
export const setOnUnauthorized = (fn) => { _onUnauthorized = fn; };

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  if (_token) {
    config.headers.Authorization = `Bearer ${_token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (
      err.response?.status === 401 &&
      !err.config.url.includes('/auth/login') &&
      _token
    ) {
      clearAuthToken();
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('fullName');
      _onUnauthorized?.();
    }
    return Promise.reject(err);
  }
);

export default api;
