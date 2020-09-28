import { mapGetters, mapMutations } from 'vuex';

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
