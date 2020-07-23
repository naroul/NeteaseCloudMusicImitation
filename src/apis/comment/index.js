import axios from 'axios';
import { Host } from '../config';

/**
 * 获取歌单评论数据
 * @param id 必传项 歌单id
 * @param limit 取出的评论数量，默认20
 * @param offset 偏移数量 用于分页
 * @param limit 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
 */
export const getCommentPlaylist = ({ id, limit, offset, before }) => {
  const url = Host + '/comment/playlist';

  return axios.get(url, {
    params: {
      id,
      limit,
      offset,
      before,
    },
    withCredentials: true,
  });
};

/**
 * 获取15条歌单热门评论数据
 * @param id 必传项 歌单id
 * @param before 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
 */
export const getHotCommentPlaylist = ({ id, before }) => {
  const url = Host + '/comment/hot';

  return axios.get(url, {
    params: {
      id,
      type: 2,
      limit: 15,
      offset: 0,
      before,
    },
    withCredentials: true,
  });
};

/**
 * 获取15条歌曲热门评论数据
 * @param id 必传项 歌单id
 * @param before 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
 */
export const getHotCommentMusic = ({ id, before }) => {
  const url = Host + '/comment/hot';

  return axios.get(url, {
    params: {
      id,
      type: 0,
      limit: 15,
      offset: 0,
      before,
    },
    withCredentials: true,
  });
};

/**
 * 获取歌曲评论
 */
export const getCommentMusic = ({ id, limit, offset, before }) => {
  const url = Host + '/comment/music';

  return axios.get(url, {
    params: {
      id,
      limit,
      offset,
      before,
    },
    withCredentials: true,
  });
};

/**
 * 发送歌单评论
 */
export const sendCommentPlaylist = ({ id, content }) => {
  const url = Host + '/comment';

  return axios.get(url, {
    params: {
      t: 1,
      type: 2,
      id,
      content,
    },
    withCredentials: true,
  });
};

/**
 * 发送歌曲评论
 */
export const sendCommentMusic = ({ id, content }) => {
  const url = Host + '/comment';

  return axios.get(url, {
    params: {
      t: 1,
      type: 0,
      id,
      content,
    },
    withCredentials: true,
  });
};

/**
 * 给歌单评论点赞
 * @param cid 评论id
 * @param id 资源id
 */
export const commentLikePlaylist = ({ id, cid }) => {
  const url = Host + '/comment/like';

  return axios.get(url, {
    params: {
      id,
      cid,
      t: 1,
      type: 2,
    },
    withCredentials: true,
  });
};

/**
 * 给歌曲评论点赞
 * @param cid 评论id
 * @param id 资源id
 */
export const commentLikeMusic = ({ id, cid }) => {
  const url = Host + '/comment/like';

  return axios.get(url, {
    params: {
      id,
      cid,
      t: 1,
      type: 0,
    },
    withCredentials: true,
  });
};

/**
 * 给歌单取消评论点赞
 * @param cid 评论id
 * @param id 资源id
 */
export const commentUnlikePlaylist = ({ id, cid }) => {
  const url = Host + '/comment/like';

  return axios.get(url, {
    params: {
      id,
      cid,
      t: 0,
      type: 2,
    },
    withCredentials: true,
  });
};

/**
 * 给歌单取消评论点赞
 * @param cid 评论id
 * @param id 资源id
 */
export const commentUnlikeMusic = ({ id, cid }) => {
  const url = Host + '/comment/like';

  return axios.get(url, {
    params: {
      id,
      cid,
      t: 0,
      type: 0,
    },
    withCredentials: true,
  });
};

/**
 * 回复歌单评论
 */
export const replyCommentPlaylist = ({ id, content, commentId }) => {
  const url = Host + '/comment';

  return axios.get(url, {
    params: {
      t: 2,
      type: 2,
      id,
      content,
      commentId,
    },
    withCredentials: true,
  });
};

/**
 * 回复歌曲评论
 */
export const replyCommentMusic = ({ id, content, commentId }) => {
  const url = Host + '/comment';

  return axios.get(url, {
    params: {
      t: 2,
      type: 0,
      id,
      content,
      commentId,
    },
    withCredentials: true,
  });
};
