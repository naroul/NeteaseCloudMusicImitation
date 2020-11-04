/**
 * Header是否显示navs栏
 */
export const isShowHeaderNavs = (state) => state.isShowHeaderNavs;

/**
 * 登录状态
 */
export const isLogged = (state) => state.isLogged;

/**
 * 是否显示登录框
 */
export const isShowLoginDialog = (state) => state.isShowLoginDialog;

/**
 * 播放列表信息对象
 */
export const playlistInfo = (state) => state.playlistInfo;

/**
 * 播放状态 是否正在播放音乐
 */
export const isPlaying = (state) => state.isPlaying;

/**
 * 播放器是否显示音量条
 */
export const isShowVolConfig = (state) => state.isShowVolConfig;

/**
 * 登录用户的id
 */
export const uuId = (state) => state.uuId;

/**
 * 将 歌曲/歌曲列表 添加到播放列表的方式
 */
export const addType = (state) => state.addType;
