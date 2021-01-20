<template>
  <PopOver :canCntClsPop="true" :canClkPop="false">
    <template v-slot:reference>
      <!-- 搜索组件 -->
      <SearchBox
        ref="searchBox"
        @input="handleInput"
        @focus="handleFocus"
        placeholder="音乐/歌手/歌单"
      ></SearchBox>
    </template>

    <!-- 搜索结果 -->
    <div class="lay" v-if="songs.length || artists.length || musiclists.length">
      <div class="itm" v-if="songs.length">
        <h3 class="hd">
          <i class="icn m-icn"></i>
          <em>单曲</em>
        </h3>

        <ul>
          <li v-for="song of songs">
            <router-link :to="`/music/song?id=${song.id}`">
              {{ song.name }}
            </router-link>
          </li>
        </ul>
      </div>

      <div class="itm" v-if="artists.length">
        <h3 class="hd">
          <i class="icn l-icn"></i>
          <em>歌手</em>
        </h3>

        <ul>
          <li v-for="artist of artists">
            <router-link :to="`/music/artist?id=${artist.id}`">
              {{ artist.name }}
            </router-link>
          </li>
        </ul>
      </div>

      <div class="itm" v-if="musiclists.length">
        <h3 class="hd">
          <i class="icn l-icn"></i>
          <em>歌单</em>
        </h3>

        <ul>
          <li v-for="itm of musiclists">
            <router-link :to="`/music/musiclist?id=${itm.id}`">
              {{ itm.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </PopOver>
</template>

<script>
import PopOver from "@/ui/PopOver";
import SearchBox from "@/ui/SearchBox";
import { search } from "@/apis/search";

export default {
  data() {
    return {
      /**
       * 搜索结果 歌曲 列表
       */
      songs: [],

      /**
       * 搜索结果 歌手 列表
       */
      artists: [],

      /**
       * 搜索结果 歌单 列表
       */
      musiclists: [],
    };
  },

  methods: {
    /**
     * 搜索框输入 回调
     */
    handleInput(keywords) {
      if (!keywords.length) {
        this.$refs.searchBox.$parent.popClose();
        return;
      }

      search({ keywords })
        .then(({ data: { code, result } }) => {
          if (!result) {
            this.songs = this.artists = this.musiclists = [];
          } else {
            this.songs = (result.song && result.song.songs) || [];
            this.artists = (result.artist && result.artist.artists) || [];
            this.musiclists =
              (result.playList && result.playList.playLists) || [];

            this.$refs.searchBox.$parent.popOpen();
          }
        })
        .catch((e) => {
          this.$toast.failed("搜索失败，未知错误");
        });
    },

    /**
     * 输入框聚焦 回调
     */
    handleFocus() {
      const { songs, artists, musiclists } = this;

      if (songs.length || artists.length || musiclists.length) {
        this.$refs.searchBox.$parent.popOpen();
      }
    },
  },

  components: {
    SearchBox,
    PopOver,
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

.lay {
  margin-top: 10px;
  width: 240px;
  box-sizing: border-box;
  border: 1px solid #bebebe;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 4px 7px #555;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.9);

  .itm {
    font-size: 12px;
    background: #fff;

    .hd {
      float: left;
      width: 52px;
      margin-right: -100px;
      padding: 10px 0 0 10px;
      border-right: 1px solid #e2e2e2;
      line-height: 17px;
      font-weight: normal;

      .icn {
        float: left;
        margin: 2px 4px 0 0;
        width: 14px;
        height: 15px;
        overflow: hidden;
        vertical-align: middle;
        background: url("~@/assets/images/Common/icon.png") no-repeat;
      }

      .m-icn {
        background-position: -35px -300px;
      }

      .a-icn {
        background-position: -50px -300px;
      }

      .l-icn {
        background-position: -50px -320px;
      }

      em {
        float: left;
        font-style: normal;
        text-align: left;
        font-size: inherit;
      }
    }

    ul {
      background: #f9f8f8;
      margin-left: 62px;
      margin-top: -1px;
      padding: 6px 0 5px;
      border-top: 1px solid #e2e2e2;
      border-left: 1px solid #e2e2e2;

      &::after {
        clear: both;
        content: ".";
        display: block;
        height: 0;
        visibility: hidden;
      }

      li {
        float: left;
        width: 100%;

        a {
          display: block;
          width: 100%;
          text-indent: 12px;
          line-height: 24px;
          color: #000;
          @include word-hide;

          &:hover {
            background: #e3e5e7;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>