import axios from 'axios';
import { Host } from '../config.js';

/**
 * 根据id获取歌单详细信息
 */
export const getPlaylistDetail = (id) => {
  const url = Host + '/playlist/detail';
  return axios.get(url, {
    params: {
      id,
    },
  });
};
