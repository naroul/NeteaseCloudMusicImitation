<template>
  <div class="bd">
    <div class="mn" v-if="playlist">
      <!-- 歌单信息部分 -->
      <div class="info">
        <!-- 歌单封面 -->
        <div class="cover">
          <img :src="playlist.coverImgUrl" />
          <span class="msk"></span>
        </div>

        <div class="cntc">
          <!-- 歌单名 -->
          <div class="hd">
            <h2>
              {{ playlist.name }}
            </h2>
          </div>

          <!-- 歌手 -->
          <div class="user">
            <router-link
              class="face"
              :to="`/user/info?id=${playlist.creator.userId}`"
            >
              <img :src="playlist.creator.avatarUrl" />
            </router-link>
            <router-link
              :to="`/user/info?id=${playlist.creator.userId}`"
              class="name"
            >
              {{ playlist.creator.nickname }}
            </router-link>
            <span class="time">
              {{ _formatMsToDate(playlist.createTime) }}
            </span>
          </div>

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
              <span>{{ playlist.subscribedCount }}</span>
            </MyButton>
          </div>

          <div class="intr">
            <b>介绍：</b>
            <span v-for="description of descriptions">
              <span>{{ description }}</span>
              <br />
            </span>
          </div>
        </div>
      </div>

      <div class="content-playcount">
        <span class="count-label">歌曲列表</span>
        <span class="count-track">{{ playlist.trackCount }}首歌</span>
        <span class="count-play">
          <span>播放：</span>
          <span class="count-number">{{ playlist.playCount }}</span>
          <span>次</span>
        </span>
      </div>

      <!-- 歌曲列表 -->
      <SongList :width="640" :songList="playlist.tracks" type="playlist" />

      <!-- 评论 -->
      <Comment v-if="playlist.id" :id="playlist.id" :type="'playlist'" />
    </div>

    <div class="sd">
      <h3 class="u-hd">相关推荐</h3>
      <ul>
        <li v-for="relate of relates">
          <div class="cvr">
            <router-link :to="`/music/musiclist?id=${relate.id}`">
              <img :src="relate.coverImgUrl" />
            </router-link>
          </div>

          <div class="lb">
            <p>
              <router-link :to="`/music/musiclist?id=${relate.id}`">
                {{ relate.name }}
              </router-link>
            </p>
            <p class="author">
              by
              <router-link :to="`/user/info?id=${relate.creator.userId}`">
                {{ relate.creator.nickname }}
              </router-link>
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getPlaylistDetail, getRelatedPlaylist } from "@/apis/playlist";
import { formatMsToDate } from "^/formatMsToDate";
import { playerMixin } from "@/mixins";
import MyButton from "@/ui/MyButton";
import SongList from "@/components/SongList";
import Comment from "@/components/Comment";

export default {
  mixins: [playerMixin],
  data() {
    return {
      /**
       * 歌单信息
       */
      playlist: null,

      /**
       * 相关歌单
       */
      relates: [],
    };
  },

  computed: {
    /**
     * 歌单描述
     */
    descriptions() {
      return this.playlist.description.split(/(\n)+/);
    },
  },

  methods: {
    /**
     * 将歌单所有歌曲替换到播放列表
     */
    plyAll() {
      /**
       * 播放歌单
       */
      this.plyPlaylist(this.playlist.id);

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
      this.addSongList(this.playlist.tracks);
    },

    /**
     * 转化创建时间
     */
    _formatMsToDate(ms) {
      return formatMsToDate(ms);
    },

    /**
     * 初始化页面
     */
    _initPage() {
      const { id } = this;

      if (!id) {
        return;
      }

      Promise.all([getPlaylistDetail({ id }), getRelatedPlaylist({ id })])
        .then(
          ([
            { data },
            {
              data: { playlists },
            },
          ]) => {
            this.playlist = data.playlist;
            this.relates = playlists;
          }
        )
        .catch((e) => {
          /**
           * 以不存在的歌单id访问时，跳到404页
           */
          if (e.response.data.code && e.response.data.code === 404) {
            this.$router.push({
              path: "/404",
            });
          }
        });
    },
  },

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
    Comment,
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

    .info {
      position: relative;
      display: flex;

      .cover {
        width: 200px;
        height: 200px;
        margin-right: 30px;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }

        .msk {
          position: absolute;
          width: 208px;
          height: 208px;
          top: -4px;
          left: -4px;
          background: url("~@/assets/images/Common/coverall.png") no-repeat;
          background-position: 0 -1285px;
        }
      }

      .cntc {
        flex: 1;

        .hd {
          margin: 0 0 12px;
          line-height: 24px;

          h2 {
            line-height: 24px;
            font-size: 20px;
            font-weight: normal;
            word-break: break-word;
          }
        }

        .user {
          margin: 0 0 20px;
          display: flex;
          align-items: center;
          font-size: 12px;

          .face {
            margin-right: 10px;

            img {
              width: 35px;
              height: 35px;
            }
          }

          .name {
            margin-right: 15px;
            color: #0c73c2;
          }

          .time {
            color: #999;
          }
        }

        .btns {
          display: flex;
          margin-bottom: 25px;

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

        .intr {
          font-size: 12px;
          max-width: 410px;
          color: #666;
        }
      }
    }

    .content-playcount {
      padding-top: 40px;
      height: 33px;
      line-height: 33px;
      border-bottom: 2px solid #c20c0c;

      .count-label {
        font-size: 20px;
        color: #333;
      }

      .count-track {
        margin-left: 20px;
        font-size: 12px;
        color: #666;
      }

      .count-play {
        float: right;
        font-size: 12px;
        color: #666;

        .count-number {
          font-size: 12px;
          font-weight: bold;
          color: #c20c0c;
        }
      }
    }
  }

  .sd {
    width: 200px;
    padding: 20px 40px 40px 30px;

    .u-hd {
      position: relative;
      height: 23px;
      margin-bottom: 20px;
      border-bottom: 1px solid #ccc;
      font-size: 12px;
      font-weight: bold;
      color: #333;
    }

    li {
      display: flex;
      width: 200px;
      height: 50px;
      margin-bottom: 15px;
      line-height: 24px;

      .cvr {
        width: 50px;
        height: 50px;
        font-size: 0;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .lb {
        margin-left: 10px;

        p {
          width: 140px;
          font-size: 14px;
          @include word-hide;

          a {
            color: #000;

            &:hover {
              text-decoration: underline;
            }
          }
        }

        .author {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
}
</style>