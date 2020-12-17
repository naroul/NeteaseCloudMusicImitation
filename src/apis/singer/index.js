import axios from 'axios';
import { Host } from '../config';

/**
 * 获取歌手分类列表
 * @param type -1:全部 1:男歌手 2:女歌手 3:乐队
 * @param area -1:全部 7华语 96欧美 8:日本 16韩国 0:其他
 * @param initial 按首字母索引查找参数, 热门传-1,#传0
 */
export const getArtist = ({ limit = 30, offset = 0, type = -1, area = -1, initial = -1 } = {}) => {
  const url = Host + '/artist/list';

  return axios.get(url, {
    params: {
			limit,
			offset,
			type,
			area,
			initial,
    },
    withCredentials: true,
  });
};