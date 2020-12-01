<template>
  <!-- 用户动态组件 -->
  <div
    v-if="isSupported"
    :class="[
      'evt-wrp',
      {
        'child-wrp': isChild,
      },
    ]"
  >
    <!-- 头像 -->
    <div class="face" v-if="!isChild">
      <router-link :to="`/user/info?id=${event.user.userId}`">
        <img class="j-flag" :src="event.user.avatarUrl" />
      </router-link>
    </div>

    <!-- 动态区 -->
    <div class="cnt-wrp">
      <!-- 用户、动态类型 -->
      <div v-if="!isChild">
        <router-link :to="`/user/info?id=${event.user.userId}`">
          {{ event.user.nickname }}
        </router-link>
        <span class="type">
          {{
            type === "song"
              ? "分享单曲"
              : type === "playlist"
              ? "分享歌单"
              : "转发"
          }}
        </span>

        <!-- 动态发布时间 -->
        <div class="time">
          {{ event.time }}
        </div>

        <!-- 动态评论 -->
        <div class="msg" v-if="event.detail && event.detail.msg">
          {{ event.detail.msg }}
        </div>
      </div>

      <div v-else>
        <!-- 转发的动态的作者 -->
        <div class="f-lb">
          <router-link to="#"> @{{ event.user.nickname }} </router-link>
          {{
            type === "song"
              ? "分享单曲："
              : type === "playlist"
              ? "分享歌单："
              : "转发："
          }}
          {{ event.detail.msg }}
        </div>
      </div>

      <!-- 被分享/转发的内容 -->
      <div
        :class="[
          'cnt',
          {
            'child-cnt': isChild,
          },
        ]"
      >
        <!-- 分享单曲 -->
        <div class="s-cnt" v-if="event.detail && type === 'song'">
          <!-- 音乐封面和按钮 -->
          <img :src="event.detail.song.album.picUrl" />
          <div class="cover-ply" @click="plySong(event.detail.song)"></div>

          <!-- 音乐名和歌手 -->
          <div class="tl-ar">
            <!-- 曲名 -->
            <h3>
              <router-link to="#">
                {{ event.detail.song.name }}
              </router-link>
            </h3>

            <!-- 歌手 -->
            <h4>
              <router-link to="#" :title="event.detail.song.artists[0].name">
                {{ event.detail.song.artists[0].name }}
              </router-link>
            </h4>
          </div>
        </div>

        <!-- 分享歌单 -->
        <div class="s-cnt" v-if="event.detail.playlist && type === 'playlist'">
          <!-- 音乐封面和按钮 -->
          <img :src="event.detail.playlist.coverImgUrl" />
          <div
            class="cover-ply"
            @click="plyList(event.detail.playlist.id)"
          ></div>

          <!-- 歌单名和作者 -->
          <div class="tl-ar">
            <!-- 曲名 -->
            <h3>
              <span class="tag"> 歌单<i class="rt"></i> </span>
              <router-link to="#">
                {{ event.detail.playlist.name }}
              </router-link>
            </h3>

            <!-- 作者 -->
            <h4>
              <router-link
                to="#"
                :title="event.detail.playlist.creator.nickname"
              >
                by&nbsp;
                {{ event.detail.playlist.creator.nickname }}
              </router-link>
            </h4>
          </div>
        </div>

        <!-- 转发 -->
        <div class="s-cnt" v-if="event.detail && type === 'event'">
          <Event :originEvent="event.detail.event" :isChild="true" />
        </div>
      </div>

      <!-- 图片展示 -->
      <Gallery :pics="event.pics" />

      <!-- 点赞区域 -->
      <div
        :class="[
          'doper',
          {
            'chid-doper': isChild,
          },
        ]"
      >
        <!-- 点赞 -->
        <span class="like" @click="handleLkBtnClick">
          <i
            :class="[
              'icn-lk',
              {
                'icn-lkd': liked,
              },
            ]"
          ></i>
          <span class="count-lk" v-if="likedCount !== 0"
            >({{ likedCount }})</span
          >
        </span>

        <span class="line">|</span>

        <!-- 转发 -->
        <span @click="showForward">
          转发
          <span v-if="event.info.shareCount !== 0"
            >({{ event.info.shareCount }})</span
          >
        </span>

        <span class="line">|</span>

        <!-- 评论 -->
        <span @click="controlCmt(true)">
          评论
          <span v-if="event.info.commentCount !== 0"
            >({{ event.info.commentCount }})</span
          >
        </span>
      </div>

      <div class="cmt" v-if="isShowCmt">
        <EditBox
          :isShowBtn="true"
          width="100%"
          :height="62"
          label="评论"
          v-model="cmt"
          @confirm="cmtCommit"
        />

        <div class="extend">
          <span @click="controlCmt(false)">收起</span>
          <i class="arw" @click="controlCmt(false)"></i>
        </div>
      </div>
    </div>

    <div v-if="isUuId" class="arw-del" title="动态管理"></div>

    <Dialog
      v-if="isShowForward"
      title="转发动态"
      :width="530"
      @close="forwardCls"
    >
      <EditBox
        :isShowBtn="true"
        label="转发"
        v-model="msg"
        @confirm="forward"
      />
    </Dialog>
  </div>
</template>

<script>
import Gallery from "../Gallery";
import Dialog from "@/ui/Dialog";
import EditBox from "@/ui/EditBox";
import { playerMixin } from "@/mixins";
import { formatMsToDate } from "^/formatMsToDate";
import {
  likeEvent,
  unlikeEvent,
  forwardEvent,
  sendEventCmt,
} from "@/apis/user";

const Type = {
  /**
   * 分享单曲
   */
  Music: 18,

  /**
   * 分享专辑
   */
  Album: 19,

  /**
   * 分享电台节目
   */
  TV: [17, 28],

  /**
   * 转发
   */
  Forward: 22,

  /**
   * 发布视频
   */
  VedioUp: 39,

  /**
   * 分享视频
   */
  VedioShare: [21, 41],

  /**
   * 分享歌单
   */
  Playlist: [13, 35],

  /**
   * 分享专栏文章
   */
  Article: 24,
};

export default {
  name: "Event",

  mixins: [playerMixin],

  props: {
    /**
     * 原始的用户动态数据
     */
    originEvent: {
      type: Object,
      required: true,
      default: null,
    },

    /**
     * 该组件是否是用于转发时的递归组件
     */
    isChild: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * 是否是登录用户本人的动态
     */
    isUuId: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      /**
       * 是否已点赞
       */
      liked: this.originEvent.info.liked,

      /**
       * 点赞数
       */
      likedCount: this.originEvent.info.likedCount,

      /**
       * 是否显示转发框
       */
      isShowForward: false,

      /**
       * 是否显示评论框
       */
      isShowCmt: false,

      /**
       * 转发时的评论信息
       */
      msg: "",

      /**
       * 评论信息
       */
      cmt: "",
    };
  },

  computed: {
    /**
     * 动态类型
     */
    type() {
      const type = this.originEvent && this.originEvent.type;

      switch (type) {
        case Type.Music:
          return "song";

        case Type.Playlist[0]:
        case Type.Playlist[1]:
          return "playlist";

        case Type.Forward:
          return "event";
      }
    },

    /**
     * 格式化后的数据
     */
    event() {
      return this._formatOriginData(this.originEvent);
    },

    /**
     * 是否支持此类型的动态数据
     */
    isSupported() {
      return this._calIsSupported(this.event);
    },
  },

  methods: {
    /**
     * 播放单曲
     */
    plySong(song) {
      this.addPlySong(song);

      /**
       * 设置播放状态为true
       */
      this.setPlayStatus(true);
    },

    /**
     * 播放歌单
     */
    plyList(id) {
      this.plyPlaylist(id);

      /**
       * 设置播放状态为true
       */
      this.setPlayStatus(true);
    },

    /**
     * 点击点赞按钮
     */
    handleLkBtnClick() {
      const { threadId } = this.event.info;

      try {
        if (this.liked) {
          unlikeEvent({ threadId }).then(() => {
            this.liked = false;
            this.likedCount -= 1;
          });
        } else {
          likeEvent({ threadId }).then(() => {
            this.liked = true;
            this.likedCount += 1;
          });
        }
      } catch (e) {
        this.$toast.failed(e.toString());
      }
    },

    /**
     * 点击转发回调
     */
    showForward() {
      this.isShowForward = true;
    },

    /**
     * 转发
     */
    forward(msg) {
      forwardEvent({
        uid: this.event.user.userId,
        evId: this.event.info.resourceId,
        forwards: this.msg,
      })
        .then(() => {
          this.isShowForward = false;
          this.msg = "";
          this.$toast.success("转发成功");
        })
        .catch(() => {
          this.isShowForward = false;
          this.$toast.failed("转发失败");
        });
    },

    /**
     * 关闭转发窗口
     */
    forwardCls() {
      /**
       * 重置评论信息，防止下次点击显示
       */
      this.msg = "";

      /**
       * 关闭窗口
       */
      this.isShowForward = false;
    },

    /**
     * 显示评论
     */
    controlCmt(status) {
      this.isShowCmt = status;

      if (!status) {
        this.cmt = "";
      }
    },

    /**
     * 提交评论
     */
    cmtCommit() {
      sendEventCmt({
        threadId: this.event.info.threadId,
        content: this.cmt,
      })
        .then(() => {
          this.isShowCmt = false;
          this.cmt = "";
          this.$toast.success("评论成功");
        })
        .catch(() => {
          this.isShowCmt = false;
          this.$toast.failed("评论失败");
        });
    },

    /**
     * 计算是否符合能显示的动态规范
     */
    _calIsSupported(event) {
      switch (event.type) {
        case Type.Music:

        case Type.Playlist[0]:

        case Type.Playlist[1]:
          return true;

        case Type.Forward:
          return this._calIsSupported(event.detail.event);

        default:
          return false;
      }
    },

    /**
     * 格式化用户动态数据
     */
    _formatOriginData(originData) {
      const { user, type, pics, info } = originData,
        detail = JSON.parse(originData.json),
        time = formatMsToDate(originData.eventTime);

      return {
        user,
        type,
        time,
        info,
        pics,
        detail,
      };
    },
  },

  components: {
    Gallery,
    Dialog,
    EditBox,
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

.evt-wrp {
  width: 100%;
  position: relative;
  padding: 20px 0;
  display: flex;
  border-bottom: 1px solid;
  border-color: #e8e8e9;

  .face {
    width: 54px;

    img {
      width: 45px;
      height: 45px;
    }
  }

  .cnt-wrp {
    padding-top: 4px;
    flex: 1;
    font-size: 14px;

    a {
      color: #0c73c2;

      &:hover {
        text-decoration: underline;
      }
    }

    .type {
      margin-left: 5px;
    }

    .time {
      margin-top: 7px;
      font-size: 12px;
      color: #999;
    }

    .msg {
      margin-top: 10px;
      line-height: 24px;
      font-size: 14px;
      @include word-wrap;
    }

    .cnt {
      display: flex;
      padding: 10px;
      margin: 4px 0 5px;
      background: #f5f5f5;

      .s-cnt {
        width: 100%;
        position: relative;
        display: flex;

        img {
          width: 40px;
          height: 40px;
        }

        .cover-ply {
          position: absolute;
          top: 0;
          left: 0;
          width: 40px;
          height: 40px;
          background: url("~@/assets/images/Common/sprite.png");
          background-position: -100px -70px;
          cursor: pointer;
          opacity: 0.8;

          &:hover {
            opacity: 1;
          }
        }

        .tl-ar {
          margin-left: 10px;

          .tag {
            display: inline-flex;
            padding: 0 0px 0 3px;
            line-height: 16px;
            height: 16px;
            font-size: 12px;
            color: #e03f40;
            background: url("~@/assets/images/Common/sprite.png");
            background-position: -110px 0;

            .rt {
              display: inline-block;
              width: 3px;
              height: 16px;
              background: url("~@/assets/images/Common/sprite.png");
              background-position: right 0;
              font-size: 12px;
            }
          }

          h3,
          h4 {
            font-weight: normal;
            line-height: 22px;
            @include word-hide;
          }

          h3 {
            margin-top: -2px;
            font-size: 14px;

            a {
              color: #333;
            }
          }

          h4 {
            font-size: 12px;

            a {
              color: #666;
            }
          }
        }

        .f-lb {
          color: #666;
          font-size: 12px;
          line-height: 24px;
          @include word-wrap;
        }
      }
    }

    .child-cnt {
      background: #fff;
    }

    .doper {
      margin: 18px 0 -2px;
      text-align: right;
      line-height: normal;
      font-size: 12px;
      color: #0c73c2;

      span {
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }

      .like {
        &:hover {
          text-decoration: none;
        }

        .icn-lk {
          display: inline-block;
          vertical-align: text-bottom;
          width: 14px;
          height: 14px;
          background: url("~@/assets/images/Common/sprite.png");
          background-position: 0 -20px;
          cursor: pointer;
        }

        .icn-lkd {
          background-position: -20px -20px;
        }

        .count-lk {
          line-height: normal;
        }
      }

      .line {
        color: #c7c7c7;
        margin: 0 10px 0 12px;
      }
    }

    .chid-doper {
      opacity: 0.5;
    }

    .cmt {
      position: relative;
      margin: 12px 0 0;
      padding: 15px;
      border: 1px solid #d9d9d9;
      background: #f8f8f8;
      border-radius: 2px;
      line-height: 20px;
      box-shadow: inset 0 0 0 1px #fcfcfc;
    }

    .extend {
      font-size: 12px;
      margin-top: 20px;
      padding-top: 18px;
      padding-right: 5px;
      border-top: 1px dotted #ccc;
      text-align: right;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }

      .arw {
        display: inline-block;
        margin-left: 3px;
        padding-bottom: 2px;
        cursor: pointer;
        width: 11px;
        height: 8px;
        background: url("~@/assets/images/Common/icon.png");
        background-position: -1px -721px;
        overflow: hidden;
        vertical-align: middle;
      }
    }
  }

  .arw-del {
    position: absolute;
    top: 20px;
    right: 0;
    width: 19px;
    height: 19px;
    background: url("~@/assets/images/Common/sprite.png");
    background-position: -15px 0;
    cursor: pointer;
  }
}

.child-wrp {
  padding: 0;
  border: none;
}
</style>