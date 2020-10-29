import axios from 'axios';
import { Host } from '../config';

/**
 * 根据id获取用户详情
 */
export const getUserDetail = ({ id }) => {
  const url = Host + '/user/detail';

  return axios.get(url, {
    params: {
      uid: id,
    },
  });
};

/**
 * 获取用户播放记录
 * @param id 用户id
 * @param type 播放记录类型 1表示一周记录 0表示所有记录
 */
export const getUserRecord = ({ id, type }) => {
  const url = Host + '/user/record';

  return axios.get(url, {
    params: {
      uid: id,
      type,
    },
    withCredentials: true,
  });
};

/**
 * 获取用户歌单（创建、收藏）
 */
export const getUserPlaylist = ({ id, limit, offset } = { limit: 30 }) => {
  const url = Host + '/user/playlist';

  return axios.get(url, {
    params: {
      uid: id,
      limit,
      offset,
    },
    withCredentials: true,
  });
};
