import axios from 'axios';
import { Host } from '../config.js';

/**
 * 获取歌单分类
 */
export const getPlaylistCat = () => {
  const url = Host + '/playlist/catlist';
  return axios.get(url);
};

/**
 * 获取热门歌单分类
 */
export const getHotPlaylistCat = () => {
  const url = Host + '/playlist/hot';
  return axios.get(url);
};

/**
 * 获取精品歌单
 * @param order 可选值为 new 或 hot 默认hot
 * @param cat 分类 默认为全部
 * @param limit 歌单数量 默认50
 * @param offset 偏移量
 */
export const getTopPlaylist = ({ order, cat, limit, offset, before }) => {
  const url = Host + '/top/playlist';
  return axios.get(url, {
    params: {
      order,
      cat,
      limit,
      offset,
      before,
    },
  });
};

/**
 * 获取精选精品歌单
 * @param cat 分类 默认为全部
 * @param limit 歌单数量 默认20
 */
export const getHighPlaylist = ({ cat, limit, before }) => {
  const url = Host + '/top/playlist/highquality';
  return axios.get(url, {
    params: {
      cat,
      limit,
      before,
    },
  });
};

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

/**
 * 获取相关歌单推荐
 * @param id 歌单id
 */
export const getRelatedPlaylist = ({ id }) => {
  const url = Host + '/related/playlist';
  return axios.get(url, {
    params: {
      id,
    },
  });
};
