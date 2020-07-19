import axios from 'axios';
import { Host } from '../config';
import { getPlaylistDetail } from '../playlist';

/**
 * 获取所有榜单信息
 */
export const getAllToplist = () => {
  const url = Host + '/toplist/detail';

  return axios.get(url);
};

/**
 * 获取单个榜单数据
 */
export const getToplistCur = (id) => {
  return getPlaylistDetail(id);
};
