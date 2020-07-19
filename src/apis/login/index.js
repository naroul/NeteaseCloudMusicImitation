import axios from 'axios';
import { Host } from '../config.js';

/**
 * 登录
 */
export const loginByPhone = (phone, password) => {
  const url = Host + '/login/cellphone';
  return axios.get(url, {
    params: {
      phone,
      password,
    },
    withCredentials: true,
  });
};