import { mapGetters, mapMutations, mapActions } from 'vuex';

export const headerMixin = {
  computed: {
    ...mapGetters(['isShowHeaderNavs']),
  },

  methods: {
    ...mapMutations(['setIsShowHeaderNavs']),
  },
};

/**
 * 登录相关 mixin
 */
export const loginMixin = {
  computed: {
    ...mapGetters(['isLogged', 'isShowLoginDialog']),
  },

  methods: {
    ...mapMutations(['setLoginStatus', 'setLoginDialogStatus']),
  },
};

/**
 * 播放相关 mixin
 */
export const playerMixin = {
  computed: {
    ...mapGetters(['playlistInfo', 'addType', 'isPlaying', 'isShowVolConfig']),
  },

  methods: {
    ...mapMutations([
      'setAddType',
      'replacePlaylistInfo',
      'addToPlaylistInfo',
      'setPlayStatus',
      'setVolConfigStatus',
    ]),

    ...mapActions([
      'addToPlaylistInfoActs',
      'addPlayToPlaylistInfo',
      'replacePlaylistInfoActs',
    ]),
  },
};

/**
 * 用户相关 mixin
 */
export const userMixin = {
  computed: {
    ...mapGetters(['uuId', 'userInfo']),
  },

  methods: {
    ...mapMutations(['setUuId', 'setUserInfo']),
  },
};
