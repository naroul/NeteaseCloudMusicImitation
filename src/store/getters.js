import { state } from './state';

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
 * 正在播放的歌曲在播放列表中所对应的index
 */
export const curSongIndex = (state) => state.curSongIndex;

/**
 * 播放状态 是否正在播放音乐
 */
export const isPlaying = (state) => state.isPlaying;

/**
 * 播放器是否显示音量条
 */
export const isShowVolConfig = (state) => state.isShowVolConfig;

/**
 * 将 歌曲/歌曲列表 添加到播放列表的方式
 */
export const addType = (state) => state.addType;

/**
 * 用户页面对应用户的数据
 * type  {
 *
 *  //用户等级
 * 	level: 0,
 *
 *  //用户简介
 * 	profile: {},
 */
export const userInfo = (state) => state.userInfo;


/**
 * 登录用户的id
 */
export const uuId = () => localStorage.uuId;

/**
 * 音量条的高度
 */
export const vol = () => Number(localStorage.vol);

/**
 * 歌曲播放列表数据源 对应 Player组件中的 playlistInfo
 */
export const tracks = () => localStorage.tracks && JSON.parse(localStorage.tracks);
