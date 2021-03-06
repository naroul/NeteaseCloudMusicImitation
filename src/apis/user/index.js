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
    withCredentials: true,
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

/**
 * 获取用户关注列表
 * @param id 必传项 用户id
 * @param limit 取出的评论数量，默认30
 * @param offset 偏移数量 用于分页
 */
export const getUserFollows = ({ id, limit = 20, offset } = {}) => {
  const url = Host + '/user/follows';

  return axios.get(url, {
    params: {
      uid: id,
      limit,
      offset,
    },
    withCredentials: true,
  });
};

/**
 * 获取用户粉丝列表
 * @param id 必传项 用户id
 * @param limit 返回数量，默认30
 * @param lasttime 返回数据的 lasttime ,默认-1,传入上一次返回结果的 lasttime,将会返回下一页的数据
 */
export const getUserFolloweds = ({ id, limit, lasttime }) => {
  const url = Host + '/user/followeds';

  return axios.get(url, {
    params: {
      uid: id,
      limit,
      lasttime,
    },
    withCredentials: true,
  });
};

/**
 * 获取用户动态
 * @param id 必传项 用户id
 * @param limit 返回数量，默认30
 * @param lasttime 返回数据的 lasttime ,默认-1,传入上一次返回结果的 lasttime,将会返回下一页的数据
 */
export const getUserEvents = ({ id, limit, lasttime }) => {
  const url = Host + '/user/event';

  return axios.get(url, {
    params: {
      uid: id,
      limit,
      lasttime,
    },
    withCredentials: true,
  });
};

/**
 * 点赞动态
 */
export const likeEvent = ({ threadId }) => {
  const url = Host + '/resource/like';

  return axios.get(url, {
    params: {
      type: 6,
      t: 1,
      threadId
    },
    withCredentials: true,
  })
}

/**
 * 取消点赞动态
 */
export const unlikeEvent = ({ threadId }) => {
  const url = Host + '/resource/like';

  return axios.get(url, {
    params: {
      type: 6,
      t: 0,
      threadId
    },
    withCredentials: true,
  })
}

/**
 * 转发用户动态
 * @param uid 用户id
 * @param evId 动态id
 * @param forwards 评论
 */
export const forwardEvent = ({ uid, evId, forwards }) => {
  const url = Host + '/event/forward';

  return axios.get(url, {
    params: {
      uid,
      evId,
      forwards
    },
    withCredentials: true,
  })
}

/**
 * 发送动态评论
 * @param threadId 动态id
 * @param content 评论内容
 * @param commentId 回复的评论id（评论时必填）
 */
export const sendEventCmt = ({ t = 1, type = 6, threadId, content, commentId } = {}) => {
  const url = Host + '/comment';

  return axios.get(url, {
    params: {
      t,
      type,
      threadId,
      content,
      commentId
    },
    withCredentials: true,
  })
}

/**
 * 删除动态
 * @param evId 动态id
 */
export const deleteEvent = ({ evId }) => {
  const url = Host + '/event/del';

  return axios.get(url, {
    params: {
      evId
    },
    withCredentials: true,
  })
}

/**
 * 关注 / 取消关注用户
 * @param id 需要关注/取消关注用户的id
 * @param t 1为关注 其它为取消关注
 */
export const follow = ({ t = 1, id } = {}) => {
  const url = Host + '/follow';

  return axios.get(url, {
    params: {
      id,
      t
    },
    withCredentials: true,
  })
}

/**
 * 取消关注用户
 * @param id 需要取消关注用户的id
 * @param t 1为关注 其它为取消关注
 */
export const unfollow = ({ t = 0, id } = {}) => {
  const url = Host + '/follow';

  return axios.get(url, {
    params: {
      id,
      t
    },
    withCredentials: true,
  })
}

/**
 * 发送私信
 * @param id 发送私信的目标用户id
 * @param msg 私信内容
 */
export const sendMsg = ({ id, msg }) => {
  const url = Host + '/send/text';

  return axios.get(url, {
    params: {
      user_ids: id,
      msg,
    },
    withCredentials: true,
  })
}

/**
 * 获取登录用户等级信息
 */
export const getLevel = () => {
  const url = Host + '/user/level';

  return axios.get(url, {
    withCredentials: true,
  })
}

/**
 * 获取登录用户账号信息
 */
export const getAccountInfo = () => {
  const url = Host + '/user/account';

  return axios.get(url, {
    withCredentials: true,
  })
}

/**
 * 获取登录用户账号信息
 */
export const setAccountInfo = ({ gender, birthday, nickname, province, city, signature }) => {
  const url = Host + '/user/update';

  return axios.get(url, {
    params: {
      gender,
      birthday,
      nickname,
      province,
      city,
      signature
    },
    withCredentials: true,
  })
}
