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
};
