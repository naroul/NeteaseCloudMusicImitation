import axios from 'axios';
import { Host } from '../config';

/**
 * 获取私信（需登录）
 * @param limit 返回数量 可不传，默认30
 * @param offset 偏移数量 可不传，默认0
 */
export const getPrivateMsg = ({ limit, offset } = { limit: 30, offset: 0 }) => {
  const url = Host + '/msg/private';

  return axios.get(url, {
    params: {
      limit,
      offset,
    },
    withCredentials: true,
  });
};
