import axios from 'axios';
import { Host } from '../config';

/**
 * 获取歌手详情
 */
export const getArtistDetail = (id) => {
  const url = Host + '/artist/detail';

  return axios.get(url, {
    params: {
			id
    },
    withCredentials: true,
  });
};

/**
 * 获取相似歌手
 */
export const getArtistSim = (id) => {
  const url = Host + '/simi/artist';

  return axios.get(url, {
    params: {
			id
    },
    withCredentials: true,
  });
};

/**
 * 获取歌手热门50首歌曲
 */
export const getArtistTopSong = (id) => {
  const url = Host + '/artist/top/song';

  return axios.get(url, {
    params: {
			id
    },
    withCredentials: true,
  });
};