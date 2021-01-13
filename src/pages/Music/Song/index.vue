<template>
  <!-- 歌曲详情页 -->
  <div class="bd">
    <div class="mn" v-if="song">
      <div class="lycifo">
        <div class="cd">
          <img :src="`${song.al.picUrl}?param=130y130`" />
          <span class="msk"></span>
        </div>

        <div class="cnt">
          <h2 class="tit">{{ song.name }}</h2>

          <p class="ar">
            歌手：
            <span :title="song.ar[0].name">
              <router-link :to="`/music/artist?id=${song.ar[0].id}`">
                {{ song.ar[0].name }}
              </router-link>
            </span>
          </p>

          <p class="al">
            所属专辑：
            <span :title="song.al.name">
              <span>
                {{ song.al.name }}
              </span>
            </span>
          </p>

          <!-- 按钮 -->
          <div class="btns">
            <!-- 播放并替换播放列表 -->
            <MyButton
              :width="70"
              :height="30"
              @clk="ply(song)"
              class="btn-play btn-flex"
            >
              <i class="iconfont icon-play" />
              <span>播放</span>
            </MyButton>

            <!-- 添加到播放列表 -->
            <MyButton
              :width="30"
              :height="30"
              @clk="add(song)"
              class="btn-add btn-flex btn-space"
            >
              <i class="iconfont icon-add-select" />
            </MyButton>

            <!-- 添加收藏 -->
            <MyButton
              title="暂不支持收藏"
              :height="30"
              class="btn-collection btn-flex btn-space"
            >
              <i class="iconfont icon-addfile" />
              <span>收藏</span>
            </MyButton>
          </div>

          <!-- 歌词 -->
          <div v-if="lyric && lyric.length">
            <ul
              :class="[
                'lycwrp',
                {
                  expand: isExpand,
                },
              ]"
            >
              <li v-for="cnt of lyric">
                {{ cnt }}
              </li>
            </ul>

            <li class="opr" @click="expand">
              {{ isExpand ? "收起" : "展开" }}
            </li>
          </div>

          <div class="nolyc" v-else>纯音乐，无歌词</div>
        </div>
      </div>

      <!-- 评论 -->
      <Comment v-if="song.id" :id="song.id" :type="'music'" />
    </div>

    <div class="sd">
      <h3 class="u-hd">相似歌曲</h3>
      <ul>
        <li v-for="simSong of songs">
          <div class="txt">
            <div class="f-thide">
              <router-link class="f-name" :to="`/music/song?id=${simSong.id}`">
                {{ simSong.name }}
              </router-link>
            </div>
            <div class="f-thide">
              <router-link
                class="f-ar"
                :to="`/music/artist?id=${simSong.artists[0].id}`"
              >
                {{ simSong.artists[0].name }}
              </router-link>
            </div>
          </div>

          <!-- 播放按钮 -->
          <i class="icon play" @click="ply(simSong)"></i>

          <!-- 添加按钮 -->
          <i class="icon add" @click="add(simSong)"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getSongDetail, getLyric, getSimSong } from "@/apis/song";
import { playerMixin } from "@/mixins";
import { formatLyric } from "^/formatLyric";
import MyButton from "@/ui/MyButton";
import Comment from "@/components/Comment";

export default {
  mixins: [playerMixin],
  data() {
    return {
      /**
       * 歌曲数据
       */
      song: null,

      /**
       * 相似歌曲列表
       */
      songs: [],

      /**
       * 歌词数组
       */
      lyric: [],

      /**
       * 是否展开歌词
       */
      isExpand: false,
    };
  },

  methods: {
    /**
     * 播放歌曲
     */
    ply(song) {
      this.addPlySong(song);
    },

    /**
     * 添加歌曲到播放列表
     */
    add(song) {
      this.addSong(song);
    },

    /**
     * 展开/收起歌词
     */
    expand() {
      this.isExpand = !this.isExpand;
    },

    async _initPage() {
      const { id } = this;

      await Promise.all([
        getSongDetail({ ids: id }),
        getLyric({ id }),
        getSimSong({ id }),
      ])
        .then(
          ([
            { data },
            {
              data: { lrc },
            },
            {
              data: { songs },
            },
          ]) => {
            this.song = data.songs[0];

            /**
             * 纯音乐无歌词
             */
            if (lrc) {
              this.lyric = formatLyric(lrc.lyric).cnts;
            }

            this.songs = songs;
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
     * 赋值实例属性id，存储歌曲id
     */
    this.id = this.$route.query.id;

    /**
     * 初始化页面
     */
    this._initPage();
  },

  components: {
    MyButton,
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
    padding: 37px 30px 40px 39px;

    .lycifo {
      display: flex;

      .cd {
        position: relative;
        width: 198px;
        height: 198px;

        img {
          display: block;
          width: 130px;
          height: 130px;
          margin: 34px;
        }

        .msk {
          position: absolute;
          width: 206px;
          height: 205px;
          top: -4px;
          left: -4px;
          background: url("~@/assets/images/Common/coverall.png") no-repeat;
          background-position: -140px -580px;
        }
      }

      .cnt {
        flex: 1;
        padding-left: 30px;

        .tit {
          margin-bottom: 20px;
          line-height: 30px;
          font-size: 24px;
        }

        p {
          margin: 10px 0;
          font-size: 12px;
        }

        a {
          color: #0c73c2;
        }

        .ar,
        .al {
          color: #999;
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

        .lycwrp {
          height: 385px;
          overflow: hidden;

          li {
            margin: 6px 0;
            line-height: 23px;
            font-size: 12px;
            color: #333;
          }
        }

        .opr {
          margin-top: 5px;
          color: #0c73c2;
          font-size: 12px;
          cursor: pointer;
        }

        .expand {
          height: auto;
        }

        .nolyc {
          height: 30px;
          line-height: 30px;
          font-size: 12px;
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

    ul {
      li {
        margin-top: 10px;
        display: flex;
        align-items: center;
        font-size: 12px;

        .txt {
          margin-right: 10px;
          width: 150px;
          line-height: 16px;

          .f-thide {
            height: 16px;
            line-height: 16px;
            @include word-hide;
          }

          .f-name {
            color: #333;
          }

          .f-ar {
            color: #999;
          }
        }

        .icon {
          width: 10px;
          height: 11px;
          background: url("~@/assets/images/Common/icon2.png") no-repeat;
          opacity: 0.9;
          cursor: pointer;
        }

        .play {
          margin-right: 16px;
          background-position: -69px -455px;
        }

        .add {
          background-position: -87px -454px;
        }
      }
    }
  }
}
</style>