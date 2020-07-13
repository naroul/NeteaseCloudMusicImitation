import axios from 'axios';
import { Host } from '../config.js';

/**
 * 获取登录状态并返回结果
 */
export const getLoginStatus = async () => {
  const url = Host + '/login/status';
  return axios.get(url);
};
