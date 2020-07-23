<template>
  <div class="comment">
    <!-- 评论 标题 -->
    <div class="comment-label">
      <span class="label-text">评论</span>
      <span v-if="comments" class="comment-count"
        >共{{ comments.data.total }}条评论</span
      >
    </div>

    <!-- 输入框 -->
    <div class="comment-edit">
      <img
        src="http://s4.music.126.net/style/web2/img/default/default_avatar.jpg?param=50y50"
      />
      <div class="arrow-left"></div>
      <textarea
        class="comment-input"
        v-model="editValue"
        type="text"
        placeholder="评论"
        @click="editPrepare"
        :readonly="!isLogged"
      />
      <div class="comment-btns">
        <span :class="['remainder', { 'red-font': editRemainder < 0 }]">
          {{ editRemainder }}
        </span>
        <MyButton class="comment-btn" :onclick="editConfirm">评论</MyButton>
      </div>
    </div>

    <!-- 最新热评 -->
    <div v-if="hotCmts && hotCmts.data.hotComments.length">
      <div class="cmts-label">最新热评</div>

      <!-- 用户评论 -->
      <div
        class="cmt-wrapper"
        v-for="hotCmt of hotCmts.data.hotComments"
        :key="hotCmt.commentId"
      >
        <img :src="hotCmt.user.avatarUrl" />
        <div class="cmt-content">
          <div class="cmt">
            <span class="usr-name">
              {{ hotCmt.user.nickname }}<span>:</span>
            </span>
            <span class="usr-cmt">{{ hotCmt.content }} </span>
          </div>

          <!-- 被回复的评论 -->
          <div class="replied-cmt" v-if="hotCmt.beReplied.length">
            <div class="replied-arrow"></div>
            <span class="replied-name">
              {{ hotCmt.beReplied[0].user.nickname }}<span>:</span>
            </span>
            <span class="replied-content">
              {{ hotCmt.beReplied[0].content }}
            </span>
          </div>

          <!-- 评论的信息 -->
          <div class="info">
            <span>{{ _formatMsToDate(hotCmt.time) }}</span>
            <div class="opts">
              <i
                :class="[
                  'iconfont',
                  'icon-good',
                  {
                    like: likedCids.includes(hotCmt.commentId) || hotCmt.liked,
                  },
                ]"
                @click="
                  likeClicked({
                    cid: hotCmt.commentId,
                    isLiked: comment.liked,
                  })
                "
              />
              <span
                v-if="hotCmt.likedCount"
                class="count-like"
                @click="
                  likeClicked({
                    cid: hotCmt.commentId,
                    isLiked: comment.liked,
                  })
                "
              >
                (
                {{
                  getCountAfterLiked({
                    cid: hotCmt.commentId,
                    likedCount: hotCmt.likedCount,
                  }) || hotCmt.likedCount
                }}
                )
              </span>
              <span
                class="text-reply"
                @click="controlReply(hotCmt.commentId, hotCmt.user.nickname)"
              >
                回复
              </span>
            </div>
          </div>

          <!-- 回复框 -->
          <div class="reply" v-if="hotCmt.commentId === repliedId">
            <div class="reply-arrow"></div>
            <textarea class="input-reply" v-model="replyValue" type="text" />
            <div class="info-reply">
              <span :class="['remainder', { 'red-font': replyRemainder < 0 }]">
                {{ replyRemainder }}
              </span>
              <MyButton
                class="btn-reply"
                :onclick="() => reply(hotCmt.user.nickname)"
              >
                回复
              </MyButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最新评论 -->
    <div v-if="comments && comments.data.comments.length">
      <div class="cmts-label">最新评论</div>

      <!-- 用户评论 -->
      <div
        class="cmt-wrapper"
        v-for="comment of comments.data.comments"
        :key="comment.commentId"
      >
        <img :src="comment.user.avatarUrl" />
        <div class="cmt-content">
          <div class="cmt">
            <span class="usr-name">
              {{ comment.user.nickname }}<span>:</span>
            </span>
            <span class="usr-cmt">{{ comment.content }} </span>
          </div>

          <!-- 被回复的评论 -->
          <div class="replied-cmt" v-if="comment.beReplied.length">
            <div class="replied-arrow"></div>
            <span class="replied-name">
              {{ comment.beReplied[0].user.nickname }}<span>:</span>
            </span>
            <span class="replied-content">
              {{ comment.beReplied[0].content }}
            </span>
          </div>

          <!-- 评论的信息 -->
          <div class="info">
            <span>{{ _formatMsToDate(comment.time) }}</span>
            <div class="opts">
              <i
                :class="[
                  'iconfont',
                  'icon-good',
                  {
                    like:
                      likedCids.includes(comment.commentId) || comment.liked,
                  },
                ]"
                @click="
                  likeClicked({
                    cid: comment.commentId,
                    isLiked: comment.liked,
                  })
                "
              />
              <span
                v-show="
                  comment.likedCount || likedCids.includes(comment.commentId)
                "
                class="count-like"
                @click="
                  likeClicked({
                    cid: comment.commentId,
                    isLiked: comment.liked,
                  })
                "
              >
                (
                {{
                  getCountAfterLiked({
                    cid: comment.commentId,
                    likedCount: comment.likedCount,
                  }) || comment.likedCount
                }}
                )
              </span>
              <span
                class="text-reply"
                @click="controlReply(comment.commentId, comment.user.nickname)"
              >
                回复
              </span>
            </div>
          </div>

          <!-- 回复框 -->
          <div class="reply" v-if="comment.commentId === repliedId">
            <div class="reply-arrow"></div>
            <textarea class="input-reply" v-model="replyValue" type="text" />
            <div class="info-reply">
              <span :class="['remainder', { 'red-font': replyRemainder < 0 }]">
                {{ replyRemainder }}
              </span>
              <MyButton
                class="btn-reply"
                :onclick="() => reply(comment.user.nickname)"
              >
                回复
              </MyButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getCommentPlaylist,
  getCommentMusic,
  sendCommentPlaylist,
  sendCommentMusic,
  getHotCommentPlaylist,
  getHotCommentMusic,
  commentLikePlaylist,
  commentUnlikePlaylist,
  replyCommentPlaylist,
  commentLikeMusic,
  commentUnlikeMusic,
  replyCommentMusic,
} from '@/apis/comment';
import { includes, uniqBy } from 'lodash';
import { mapGetters, mapMutations } from 'vuex';
import MyButton from '@/ui/MyButton';
import { formatMsToDate } from '^/formatMsToDate';

export default {
  props: {
    /**
     * 评论对象的类型（歌单、歌曲等）
     */
    type: {
      type: String,
      required: true,
      validator(value) {
        return ['playlist', 'music'].includes(value);
      },
    },

    /**
     * 评论对象的id
     */
    id: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      /**
       * 评论数据
       */
      comments: null,

      /**
       * 15条热门评论
       */
      hotCmts: null,

      /**
       * 评论
       */
      editValue: '',

      /**
       * 回复评论
       */
      replyValue: '',

      /**
       * 正在回复的评论id
       */
      repliedId: NaN,

      /**
       * 点过赞的评论id数组
       * type: Array<{ cid: Number | String, count: Number }>
       */
      likedCids: [],
    };
  },

  computed: {
    /**
     * 评论可编辑的剩余的字数
     */
    editRemainder() {
      return 140 - this.editValue.length;
    },

    /**
     * 回复评论可编辑的剩余的字数
     */
    replyRemainder() {
      return 140 - this.replyValue.length;
    },

    ...mapGetters(['isLogged', 'isShowLoginDialog']),
  },

  watch: {
    id(newId, oldId) {
      this._initData(newId);
    },
  },

  methods: {
    /**
     * 点击评论文本框 回调
     */
    editPrepare() {
      /**
       * 未登录状态下，不可编辑，并且弹出登录框
       */
      if (this.isLogged === false && this.isShowLoginDialog === false) {
        this.setLoginDialogStatus(true);
      }
    },

    /**
     * 评论按钮 确定回调
     */
    editConfirm() {
      if (!this.isLogged) {
        return;
      }

      if (this.editRemainder < 0) {
        this.$toast.failed('评论不可超过140字');
      } else if (this.editValue === '') {
        this.$toast.failed('请输入内容在提交评论');
      } else {
        this._sendComment({ id: this.id, content: this.editValue })
          .then((res) => {
            this.$toast.success('评论成功');
            this.editValue = '';
          })
          .catch((e) => {
            this.$toast.failed('评论失败');
          });
      }
    },

    /**
     * 点击文字“回复”后的回调
     */
    controlReply(commentId, nickname) {
      if (!this.isLogged) {
        this.$toast.failed('请登录后再评论');
        return;
      }

      if (this.repliedId && this.repliedId === commentId) {
        /**
         * 如果存在repliedId，且操作的是回复框展开状态的评论
         */
        this.repliedId = NaN;
      } else {
        /**
         * 两种情况
         * 1、如果存在repliedId，但操作的不是回复框展开状态的评论
         * 2、如果不存在repliedId，则没有展开的回复框
         * 这两种情况都直接展开点击回复的评论的回复框
         */
        this.repliedId = commentId;
        this.replyValue = `回复${nickname}:`;
      }
    },

    /**
     * 评论按钮 确定回调
     */
    reply(nickname) {
      if (!this.isLogged) {
        this.$toast.failed('请登录后再回复');
        return;
      }

      if (this.replyRemainder < 0) {
        this.$toast.failed('回复不可超过140字');
      } else if (
        this.replyValue === '' ||
        this.replyValue === `回复${nickname}:`
      ) {
        this.$toast.failed('请输入内容在提交评论');
      } else {
        this._replyComment({
          id: this.id,
          content: this.replyValue,
          commentId: this.repliedId,
        })
          .then((res) => {
            this.$toast.success('回复成功');
            this.replyValue = '';
            this.repliedId = NaN;
          })
          .catch((e) => {
            this.$toast.failed('回复失败');
            this.replyValue = '';
            this.repliedId = NaN;
          });
      }
    },

    /**
     * 点赞回调
     */
    likeClicked({ cid, isLiked }) {
      if (!this.isLogged) {
        this.$toast.failed('请登录后再进行操作');
        return;
      }

      const { likedCids } = this;

      if (!isLiked && !includes(this.likedCids, cid)) {
        /**
         * 将点赞的评论id加入点赞的临时存储数组likedCids并去重
         */
        this._commentLike({ id: this.id, cid }).then((res) => {
          this.likedCids = [...new Set([...this.likedCids, cid])];
        });
      } else {
        /**
         * 当点击已点赞的情况,取消点赞
         */
        this._commentUnlike({ id: this.id, cid }).then((res) => {
          this.likedCids.splice(likedCids.indexOf(cid), 1);
        });
      }
    },

    /**
     * 返回点赞后 在原点赞数上 +1 的点赞数
     */
    getCountAfterLiked({ cid, likedCount }) {
      if (includes(this.likedCids, cid)) {
        return likedCount + 1;
      } else {
        return NaN;
      }
    },

    /**
     * 将毫秒转换成日期
     */
    _formatMsToDate(ms) {
      return formatMsToDate(ms);
    },

    /**
     * 根据type调用获取评论接口
     */
    _getHotComments({ id, before }) {
      switch (this.type) {
        case 'playlist':
          return getHotCommentPlaylist({ id, before });
        case 'music':
          return getHotCommentMusic({ id, before });
      }
    },

    /**
     * 根据type调用获取评论接口
     */
    _getComments({ id, limit, offset, before }) {
      switch (this.type) {
        case 'playlist':
          return getCommentPlaylist({ id, limit, offset, before });
        case 'music':
          return getCommentMusic({ id, limit, offset, before });
      }
    },

    /**
     * 发送评论
     */
    _sendComment({ id, content }) {
      switch (this.type) {
        case 'playlist':
          return sendCommentPlaylist({ id, content });
        case 'music':
          return sendCommentMusic({ id, content });
      }
    },

    /**
     * 回复评论
     */
    _replyComment({ id, content, commentId }) {
      switch (this.type) {
        case 'playlist':
          return replyCommentPlaylist({ id, content, commentId });
        case 'music':
          return replyCommentMusic({ id, content, commentId });
      }
    },

    /**
     * 给评论点赞
     */
    _commentLike({ id, cid }) {
      switch (this.type) {
        case 'playlist':
          return commentLikePlaylist({ id, cid });
        case 'music':
          return commentLikeMusic({ id, cid });
      }
    },

    /**
     * 取消评论点赞
     */
    _commentUnlike({ id, cid }) {
      switch (this.type) {
        case 'playlist':
          return commentUnlikePlaylist({ id, cid });
        case 'music':
          return commentUnlikeMusic({ id, cid });
      }
    },

    /**
     * 初始化数据
     */
    _initData(id) {
      /**
       * 获取15条热门评论
       */
      this._getHotComments({ id }).then((res) => {
        this.hotCmts = res;
      });

      /**
       * 获取评论
       */
      this._getComments({ id }).then((res) => {
        this.comments = res;
        console.log(this.comments);
      });
    },

    ...mapMutations(['setLoginDialogStatus']),
  },

  created() {
    this._initData(this.id);
  },

  components: {
    MyButton,
  },
};
</script>

<style lang="scss" scoped>
@import '#/scss/global.scss';

.comment {
  margin-top: 40px;

  .comment-label {
    height: 33px;
    line-height: 33px;
    border-bottom: 2px solid #c20c0c;

    .label-text {
      font-size: 20px;
      color: #333;
    }

    .comment-count {
      margin-left: 20px;
      font-size: 12px;
      color: #666;
    }
  }

  .comment-edit {
    position: relative;
    margin-top: 20px;
    margin-bottom: 20px;
    height: 100px;
    display: flex;

    img {
      width: 50px;
      height: 50px;
    }

    .arrow-left {
      position: absolute;
      left: 58px;
      top: 23px;
      height: 6px;
      width: 6px;
      background: #fff;
      border: 1px solid rgb(169, 169, 169);
      border-top: none;
      border-right: none;
      transform: rotate(45deg);
    }

    .comment-input {
      flex: 1;
      margin-left: 12px;
      height: 50px;
      padding: 6px;
      font-size: 12px;
      outline: none;
      resize: none;
    }

    .comment-btns {
      position: absolute;
      bottom: 0;
      padding-top: 10px;
      height: 25px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .comment-btn {
        width: 46px;
        height: 25px;
        margin-right: 2px;
        background: rgba(40, 120, 198, 1);
        color: #fff;
        font-size: 12px;

        &:hover {
          background: #4a93db;
        }
      }
    }
  }

  .cmts-label {
    margin-top: 30px;
    height: 20px;
    border-bottom: 1px solid #cfcfcf;
    line-height: 20px;
    font-size: 12px;
    font-weight: bold;
  }

  .cmt-wrapper {
    min-height: 50px;
    padding: 15px 0;
    display: flex;
    border-top: 1px solid #cfcfcf;

    img {
      width: 50px;
      height: 50px;
    }

    .cmt-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 2px 0 2px 10px;

      .cmt {
        .usr-name {
          color: #0c73c2;
          font-size: 12px;
        }

        .usr-cmt {
          margin-left: 5px;
          font-size: 12px;
        }
      }

      .replied-cmt {
        position: relative;
        margin-top: 10px;
        padding: 8px 19px;
        line-height: 20px;
        background: #e5e5e5;
        border: 1px solid #dedede;
        color: #666;

        .replied-arrow {
          position: absolute;
          top: -6px;
          left: 3px;
          border-bottom: 8px solid #e5e5e5;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
        }

        .replied-name {
          color: #0c73c2;
          font-size: 12px;
        }

        .replied-content {
          margin-left: 5px;
          font-size: 12px;
        }
      }

      .info {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
          font-size: 12px;
          color: #999;
        }

        .opts {
          display: flex;
          align-items: center;

          i {
            font-size: 18px;
            color: #4ebcf8;
            cursor: pointer;
          }

          .count-like {
            margin-right: 8px;
            cursor: pointer;

            &:hover {
              text-decoration: underline;
            }
          }

          .like {
            color: red;
          }

          .text-reply {
            margin-left: 8px;
            cursor: pointer;

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }

      .reply {
        position: relative;
        margin-top: 15px;
        padding: 15px;
        display: flex;
        flex-direction: column;
        background: #e5e5e5;
        border: 1px solid #fcfcfc;
        border-radius: 2px;

        .reply-arrow {
          position: absolute;
          top: -6px;
          right: 6px;
          border-bottom: 8px solid #e5e5e5;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
        }

        .input-reply {
          width: 100%;
          box-sizing: border-box;
          padding: 5px 6px 6px;
          font-size: 12px;
          border: 1px solid #cdcdcd;
          border-radius: 2px;
          line-height: 19px;
          resize: none;
        }

        .info-reply {
          padding-top: 10px;
          text-align: right;

          span {
            font-size: 12px;
            margin-right: 10px;
          }

          .btn-reply {
            width: 46px;
            height: 25px;
            margin-right: 2px;
            background: rgba(40, 120, 198, 1);
            color: #fff;
            font-size: 12px;

            &:hover {
              background: #4a93db;
            }
          }
        }
      }
    }
  }

  .remainder {
    font-size: 12px;
    color: #999;
    margin-right: 10px;
  }

  .red-font {
    color: red;
  }
}
</style>
