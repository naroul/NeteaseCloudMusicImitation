import * as _ from 'lodash';

export const mutations = {
  /**
   * 设置登录状态
   */
  setLoginStatus(state, status) {
    state.isLogged = status;
  },

  /**
   * 设置登录框状态
   */
  setLoginDialogStatus(state, status) {
    state.isShowLoginDialog = status;
  },

  /**
   * 设置播放列表信息
   */
  replacePlaylistInfo(state, list) {
    state.playlistInfo = _.uniqBy(list, 'id');
  },

  /**
   * 将 歌曲或歌曲列表 添加到当前播放列表的顶部
   * @param addition 要添加的 歌曲 或 歌曲列表
   */
  addToPlaylistInfo(state, addition) {
    state.playlistInfo = _.uniqBy(
      [addition, ...state.playlistInfo].flat(),
      'id'
    );
  },

  /**
   * 设置播放状态 是否正在播放音乐
   * @param status 播放状态 type: boolean
   */
  setPlayStatus(state, status) {
    state.isPlaying = status;
  },

  /**
   * 设置播放器是否显示音量条
   * @param status 播放状态 type: boolean
   */
  setVolConfigStatus(state, status) {
    state.isShowVolConfig = status;
  },

  /**
   * 设置登录用户id
   * @param id 用户id
   */
  setUuId(state, id) {
    state.uuId = id;
  },
};
