<template>
  <!-- 歌手详情页 -->
  <div class="bd">
    <div class="mn" v-if="artist">
      <!-- 歌手名 -->
      <h2 class="snm">{{ artist.name }}</h2>

      <!-- 歌手封面 -->
      <img class="cvr" :src="`${artist.cover}?param=640y300`" />

      <!-- 相框 -->
      <div class="msk"></div>

      <!-- 50首热门歌曲 -->
      <div class="tops">
        <div class="m-info">
          <!-- 按钮 -->
          <div class="btns">
            <!-- 播放并替换播放列表 -->
            <MyButton
              :width="70"
              :height="30"
              @clk="plyAll"
              class="btn-play btn-flex"
            >
              <i class="iconfont icon-play" />
              <span>播放</span>
            </MyButton>

            <!-- 添加到播放列表 -->
            <MyButton
              :width="30"
              :height="30"
              @clk="addSongs"
              class="btn-add btn-flex btn-space"
            >
              <i class="iconfont icon-add-select" />
            </MyButton>

            <!-- 添加收藏 -->
            <MyButton :height="30" class="btn-collection btn-flex btn-space">
              <i class="iconfont icon-addfile" />
              <span>收藏热门50</span>
            </MyButton>
          </div>

          <em class="lb">热门单曲</em>
        </div>

        <!-- 歌曲列表 -->
        <SongList v-if="songs.length" :songList="songs" type="singer" />
      </div>
    </div>

    <!-- 侧边栏，相似歌手 -->
    <div class="sd">
      <h3 class="u-hd">相似歌手</h3>

      <ul class="m-hdlst">
        <li v-for="ar of artists">
          <router-link :to="`/music/artist?id=${ar.id}`">
            <div class="hd">
              <img :src="ar.img1v1Url" />
            </div>

            <p>{{ ar.name }}</p>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getArtistDetail, getArtistSim, getArtistTopSong } from "@/apis/artist";
import { playerMixin } from "@/mixins";
import MyButton from "@/ui/MyButton";
import SongList from "@/components/SongList";

export default {
  mixins: [playerMixin],
  data() {
    return {
      /**
       * 歌手数据
       */
      artist: null,

      /**
       * 相似歌手列表
       */
      artists: [],

      /**
       * 歌手热门歌曲
       */
      songs: [],
    };
  },

  methods: {
    /**
     * 将歌单所有歌曲替换到播放列表
     */
    plyAll() {
      /**
       * 播放歌单
       */
      this.plySonglist(this.songs);

      /**
       * 设置播放状态为true
       */
      this.setPlayStatus(true);
      this.setVolConfigStatus(false);
    },

    /**
     * 将歌单所有歌曲添加到播放列表底部
     */
    addSongs() {
      this.addSongList(this.songs);
    },

    /**
     * 初始化页面
     */
    async _initPage() {
      const { id } = this;

      if (!id) {
        return;
      }

      await Promise.all([
        getArtistDetail(id),
        getArtistSim(id),
        getArtistTopSong(id),
      ])
        .then(
          ([
            {
              data: {
                data: { artist },
              },
            },
            {
              data: { artists },
            },
            {
              data: { songs },
            },
          ]) => {
            this.artist = artist;
            this.artists = artists;
            this.songs = songs;
          }
        )
        .catch((e) => {
          this.$toast.failed(e.toString());
        });
    },
  },

  /**
   * 路由改变时更新页面
   */
  async beforeRouteUpdate(to, from, next) {
    this.id = to.query.id;

    await this._initPage();

    next();
  },

  created() {
    /**
     * 赋值实例属性id，存储歌手id
     */
    this.id = this.$route.query.id;

    /**
     * 初始化页面
     */
    this._initPage();
  },

  components: {
    MyButton,
    SongList,
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

.bd {
  @include bd;
  display: flex;
  background: url("~@/assets/images/Common/wrap4.png") repeat-y center 0;

  .mn {
    position: relative;
    flex: 1;
    padding: 27px 30px 40px 39px;

    .snm {
      max-width: 75%;
      height: 34px;
      line-height: 24px;
      font-weight: normal;
      font-size: 24px;
      color: #333;

      @include word-hide;
    }

    .cvr {
      display: block;
      width: 640px;
      height: 300px;
    }

    .msk {
      position: absolute;
      top: 62px;
      left: 39px;
      width: 640px;
      height: 300px;
      background: url("~@/assets/images/Common/ban_mask.png") no-repeat;
    }

    .tops {
      margin: 20px 0 10px;

      .m-info {
        position: relative;
        border-bottom: 1px solid #ddd;

        .lb {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 12px;
          font-style: initial;
          line-height: 30px;
        }

        .btns {
          display: flex;
          padding: 10px 0;

          .btn-play {
            font-size: 12px;
            line-height: 30px;
            background: rgba(40, 120, 198, 1);
            color: #fff;
            border-radius: 3px 0 0 3px;
            border-right: 1px solid #ccc;

            &:hover {
              background: #4a93db;
            }

            .icon-play {
              font-size: 20px;
              margin-right: 3px;
            }
          }

          i,
          span {
            color: #fff;
            cursor: pointer;
          }

          .btn-add {
            background: rgba(40, 120, 198, 1);
            border-radius: 0 3px 3px 0;

            &:hover {
              background: #4a93db;
            }
          }

          .btn-collection {
            background: #e5e5e5;
            border: 1px solid #ccc;
            font-size: 12px;

            .icon-addfile {
              font-size: 20px;
              margin-right: 3px;
            }

            &:hover {
              background: #f4f4f4;
            }

            i,
            span {
              color: #000;
            }
          }

          .btn-flex {
            display: flex;
            align-items: center;
          }

          .btn-space {
            margin-right: 8px;
          }
        }
      }
    }
  }

  .sd {
    width: 200px;
    padding: 20px 40px 40px 30px;

    .u-hd {
      height: 23px;
      margin-bottom: 20px;
      border-bottom: 1px solid #ccc;
      font-size: 12px;
      font-weight: bold;
      color: #333;
    }

    .m-hdlst {
      margin-left: -25px;

      &::after {
        clear: both;
        content: ".";
        display: block;
        height: 0;
        visibility: hidden;
      }

      li {
        float: left;
        width: 50px;
        height: 92px;
        padding-left: 25px;
        cursor: pointer;

        .hd {
          width: 50px;
          height: 50px;
          font-size: 0;

          img {
            width: 50px;
            height: 50px;
            cursor: pointer;
          }
        }

        p {
          margin-top: 7px;
          width: 50px;
          text-align: center;
          font-size: 12px;
          @include word-hide;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>