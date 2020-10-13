import axios from 'axios';
import { Host } from '../config.js';

/**
 * 手机号登录
 */
export const loginByTel = (phone, password) => {
  const url = Host + '/login/cellphone';
  return axios.get(url, {
    params: {
      phone,
      password,
    },
    withCredentials: true,
  });
};

/**
 * 邮箱登录
 */
export const loginByMail = (email, password) => {
  const url = Host + '/login';
  return axios.get(url, {
    params: {
      email,
      password,
    },
    withCredentials: true,
  });
};
