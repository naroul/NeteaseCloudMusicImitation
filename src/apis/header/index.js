import axios from 'axios';
import { Host } from '../config.js';

/**
 * 获取登录状态并返回结果
 */
export const getLoginStatus = () => {
  const url = Host + '/login/status';
  return axios.get(url, {
    withCredentials: true,
  });
};

/**
 * 登出
 */
export const logout = () => {
  const url = Host + '/logout';
  return axios.get(url, {
    withCredentials: true,
  });
};
