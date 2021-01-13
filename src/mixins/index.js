import { mapGetters, mapMutations, mapActions } from 'vuex';
import { getPlaylistDetail } from '@/apis/playlist';


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
    ...mapGetters(['playlistInfo', 'curSongIndex', 'addType', 'isPlaying', 'isShowVolConfig']),
  },

  methods: {
    /**
     * 根据歌单id播放歌单
     * @param {string} id 歌单id
     */
    plyPlaylist(id) {
      getPlaylistDetail({ id }).then(({ data: { playlist } }) => {
        let list = [];

        for (let track of playlist.tracks.values()) {
          list = [
            ...list,
            {
              id: track.id,
              name: track.name,
              coverUrl: track.al.picUrl,
              picStr: track.al.pic_str,
              source: {
                id: playlist.id,
                type: '歌单',
              },
              author: {
                id: track.ar[0].id,
                name: track.ar[0].name,
              },
              mv: track.mv,
              dt: track.dt,
            },
          ];
        }

        this.replacePlaylistInfoActs(list);
      });
    },

    /**
     * 替换所有播放列表
     */
    plySonglist(list) {
      let lst = list.map( (song) => ({
        id: song.id,
        name: song.name,
        coverUrl: song.al.picUrl,
        picStr: song.al.pic || song.al.pic_str,
        author: {
          id: song.ar[0].id,
          name: song.ar[0].name,
        },
        mv: song.mv,
        dt: song.dt,
      }) )

      this.replacePlaylistInfoActs(lst);
    },

    /**
     * 将歌曲添加到播放列表的底部
     */
    addSong(song) {
      const al = song.al || song.album;
      const ar = song.ar || song.artists;
      const mv = song.mv || song.mvid;
      const dt = song.dt || song.duration;

      this.addToPlaylistInfoActs({
        id: song.id,
        name: song.name,
        coverUrl: al.picUrl,
        picStr: al.pic || al.pic_str,
        author: {
          id: ar[0].id,
          name: ar[0].name,
        },
        mv,
        dt,
      });
    },

    /**
     * 将歌曲列表添加到播放列表底部
     */
    addSongList(list) {
      let lst = list.map( (song) => ({
        id: song.id,
        name: song.name,
        coverUrl: song.al.picUrl,
        picStr: song.al.pic || song.al.pic_str,
        author: {
          id: song.ar[0].id,
          name: song.ar[0].name,
        },
        mv: song.mv,
        dt: song.dt,
      }) )

      this.addToPlaylistInfoActs(lst);
    },

    /**
     * 将歌曲添加到播放列表的底部并播放
     */
    addPlySong(song) {
      const al = song.al || song.album;
      const ar = song.ar || song.artists;
      const mv = song.mv || song.mvid;
      const dt = song.dt || song.duration;

      this.addPlayToPlaylistInfo({
        id: song.id,
        name: song.name,
        coverUrl: al.picUrl,
        picStr: al.pic_str || al.pic,
        author: {
          id: ar[0].id,
          name: ar[0].name,
        },
        mv,
        dt,
      });
    },

    ...mapMutations([
      'setAddType',
      'replacePlaylistInfo',
      'addToPlaylistInfo',
      'setCurSongIndex',
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
