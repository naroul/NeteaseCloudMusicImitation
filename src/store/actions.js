export const actions = {
  /**
   * 将 歌曲或歌曲列表 添加到当前播放列表的底部
   * @param addition 要添加的 歌曲 或 歌曲列表
   */
  addToPlaylistInfoActs({ commit }, addition) {
    /**
     * 添加歌曲到播放列表
     */
    commit('addToPlaylistInfo', addition);

    /**
     * 设置替换类型为 'addPlay'
     */
    commit('setAddType', 0);
  },

  /**
   * 将 歌曲或歌曲列表 添加到当前播放列表的底部 并且播放
   * @param addition 要添加的 歌曲 或 歌曲列表
   */
  addPlayToPlaylistInfo({ commit }, addition) {
    /**
     * 添加歌曲到播放列表
     */
    commit('addToPlaylistInfo', addition);

    /**
     * 设置替换类型为 'addPlay'
     */
    commit('setAddType', 1);
  },

  /**
   * 替换全部播放列表 并将替换类型设置为 'replace'
   */
  replacePlaylistInfoActs({ commit }, list) {
    /**
     * 替换播放列表
     */
    commit('replacePlaylistInfo', list);

    /**
     * 设置替换类型为 'replace'
     */
    commit('setAddType', 2);
  },
};
