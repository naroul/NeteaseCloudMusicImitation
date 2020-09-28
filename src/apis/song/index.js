import axios from 'axios';
import { Host } from '../config.js';

/**
 * 根据id获取歌曲url
 * @param id 歌曲id 可以是id数组
 */
export const getSongUrl = ({ id }) => {
  const url = Host + '/song/url';
  if (id && id.length) {
    return axios.get(url, {
      params: {
        id: id.join(','),
      },
      withCredentials: true,
    });
  } else {
    return axios.get(url, {
      params: {
        id,
      },
      withCredentials: true,
    });
  }
};

/**
 * 根据id获取歌曲详情
 * @param ids 歌曲id 可以是id数组 也可以是单个id
 */
export const getSongDetail = ({ ids }) => {
  const url = Host + '/song/detail';
  if (ids && ids.length) {
    return axios.get(url, {
      params: {
        ids: ids.join(','),
      },
      withCredentials: true,
    });
  } else {
    return axios.get(url, {
      params: {
        ids,
      },
      withCredentials: true,
    });
  }
};

/**
 * 根据歌曲id获取歌词
 * @param id 歌曲id
 */
export const getLyric = ({ id }) => {
  const url = Host + '/lyric';

  return axios.get(url, {
    params: {
      id,
    },
  });
};
