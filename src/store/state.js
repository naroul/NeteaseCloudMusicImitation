export const state = {
  /**
   * 登陆状态
   */
  isLogged: false,

  /**
   * 登录用户的id
   */
  uuId: '',

  /**
   * 是否显示登录框
   */
  isShowLoginDialog: false,

  /**
   * 播放列表
   * @type
   * Array< {
   *    // 歌曲id
   *    id: Number | String,
   *
   *    // 歌曲名
   *    name: String,
   *
   *    // 歌曲封面url
   *    coverUrl: String,
   *
   *    // 歌曲列表展示背景图片id
   *    picStr: Number,
   *
   *    // 来源信息  可为空
   *    source: {
   *       // 来源id
   *      id: Number | String,
   *
   *      // 来源类型
   *      type: '歌单' | '歌手'
   *    }
   *
   *    // 作者信息
   *    author: {
   *      // 作者id
   *      id: Number | String,
   *
   *      // 作者名
   *      name: String,
   *    },
   *
   *    // mv id  0代表没有mv
   *    mv: Number | String
   *
   *    // 歌曲总时长 单位ms
   *    dt: Number
   *
   *  } >
   */
  playlistInfo: [],

  /**
   * 添加歌曲/歌曲列表到播放列表的方式 分为：
   * {
   *  'add': 0, // 只添加，但不改变正在播放的歌曲
   *  'addPlay': 1, // 添加并播放最后一首歌曲
   *  'replace': 2, // 将播放列表全部替换
   * }
   */
  addType: 0,

  /**
   * 是否正在播放音乐
   */
  isPlaying: false,

  /**
   * 播放器是否显示音量条
   */
  isShowVolConfig: false,
};
