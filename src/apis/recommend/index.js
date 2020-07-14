import axios from 'axios';
import { Host, Types } from '../config.js';

/**
 * 获取轮播图数据
 */
export const getBanners = () => {
  const url = Host + '/banner';

  return axios.get(url, {
    params: {
      type: Types.pc,
    },
  });
};

/**
 * 获取热门歌单tag
 */
export const getPlaylistHot = () => {
  const url = Host + '/playlist/hot';

  return axios.get(url);
};

/**
 * 获取推荐歌单数据
 */
export const getPersonalized = () => {
  const url = Host + '/personalized';

  return axios.get(url, {
    params: {
      limit: 8,
    },
  });
};

/**
 * 获取推荐榜单摘要数据
 */
export const getToplistSummary = () => {
  const url = Host + '/toplist/detail';

  return axios.get(url);
};


