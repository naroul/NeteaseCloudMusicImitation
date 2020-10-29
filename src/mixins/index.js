import { mapGetters, mapMutations } from 'vuex';

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
    ...mapGetters(['playlistInfo', 'isPlaying', 'isShowVolConfig']),
  },

  methods: {
    ...mapMutations([
      'replacePlaylistInfo',
      'addToPlaylistInfo',
      'setPlayStatus',
      'setVolConfigStatus',
    ]),
  },
};

/**
 * 用户相关 mixin
 */
export const userMixin = {
  computed: {
    ...mapGetters(['uuId']),
  },

  methods: {
    ...mapMutations(['setUuId']),
  },
};
