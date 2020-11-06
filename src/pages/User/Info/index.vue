<template>
  <div class="usr-info">
    <div class="usr-main" v-if="userInfo">
      <!-- 用户基础信息 -->
      <Profile :isUuId="isUuId" />

      <!-- 听歌排行标题 -->
      <div class="m-record-title" v-if="authorized">
        <h3>听歌排行</h3>
        <h4>累积听歌{{ userInfo.listenSongs }}首</h4>
        <span class="point">
          <a class="icn-tip"></a>
          <div class="tip">
            <!-- icon在hover的时候显示tip -->
            <p>实际播放时间过短的歌曲将不纳入计算。</p>
            <i class="t"></i><i class="b"></i>
          </div>
        </span>

        <!-- 分类tab -->
        <div class="nav">
          <span :class="{ 'z-sel': recordType === 0 }" @click="setRecordType(0)"
            >所有时间</span
          >
          <i></i>
          <span :class="{ 'z-sel': recordType === 1 }" @click="setRecordType(1)"
            >最近一周</span
          >
        </div>
      </div>

      <!-- 听歌排行 -->
      <div class="m-record" v-if="authorized">
        <div v-if="records && records.length">
          <SongRecord
            v-for="(record, index) of records && records.slice(0, 10)"
            :key="index"
            :isShowTimes="isUuId"
            :index="index"
            :songData="record"
          />

          <!-- 查看更多 -->
          <div class="more">
            <router-link to="#">查看更多&gt;</router-link>
          </div>
        </div>

        <div v-else class="n-record">
          <h3><i class="icn-norecord"></i>暂无听歌记录</h3>
        </div>

        <!-- 加载状态 -->
        <Loading v-if="isLoadingRecord" />
      </div>

      <div v-dropload="loadMore">
        <!-- 用户创建歌单 标题 -->
        <div class="cl-title" v-if="createdPlaylist.length">
          <h3>
            <span class="f-pr">
              {{ isUuId ? "我" : userInfo.profile.nickname }}创建的歌单（{{
                userInfo.profile.playlistCount
              }}）
            </span>
          </h3>
        </div>

        <!-- 用户创建歌单展示列表 -->
        <div class="c-lst" v-if="createdPlaylist.length">
          <PlaylistSummary
            :class="['c-itm', { fst: (index + 1) % 5 === 1 }]"
            v-for="(data, index) of createdPlaylist"
            :data="data"
            :key="data.id + '-' + Math.floor(Math.random() * 1e8)"
          />
        </div>

        <!-- 用户收藏歌单 标题 -->
        <div class="cl-title" v-if="collectedPlaylist.length">
          <h3>
            <span class="f-pr">
              {{ isUuId ? "我" : userInfo.profile.nickname }}收藏的歌单（{{
                userInfo.profile.playlistCount
              }}）
            </span>
          </h3>
        </div>

        <!-- 用户收藏歌单展示列表 -->
        <div class="c-lst" v-if="collectedPlaylist.length">
          <PlaylistSummary
            :class="['c-itm', { fst: (index + 1) % 5 === 1 }]"
            v-for="(data, index) of collectedPlaylist"
            :data="data"
            :key="data.id + '-' + Math.floor(Math.random() * 1e8)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SongRecord from "@/components/SongRecord";
import Loading from "@/components/Loading";
import Profile from "@/components/Profile";
import PlaylistSummary from "@/components/PlaylistSummary";
import { userMixin } from "@/mixins";
import { getUserDetail, getUserRecord, getUserPlaylist } from "@/apis/user";

export default {
  mixins: [userMixin],
  data() {
    return {
      /**
       * 是否有权限访问播放记录
       */
      authorized: false,

      /**
       * 播放记录类型 0表示所有时间 1表示一周时间
       */
      recordType: 1,

      /**
       * 用户听歌记录数据
       */
      records: null,

      /**
       * 是否正在加载听歌记录
       */
      isLoadingRecord: false,

      /**
       * 用户歌单数据
       */
      createdPlaylist: [],

      /**
       * 用户收藏歌单数据
       */
      collectedPlaylist: [],
    };
  },

  computed: {
    /**
     * 是否是当前登录用户的Id
     */
    isUuId() {
      if (this.curUserId && this.uuId) {
        return this.curUserId == this.uuId;
      }

      /**
       * 当 id 为空时 返回 false
       */
      return false;
    },
  },

  watch: {
    /**
     * 监听用户听歌记录类型，变化时刷新记录数据
     */
    recordType(newType, oldType) {
      this._getUserRecord();
    },
  },

  methods: {
    /**
     * 设置播放记录类型
     * @param type enum { week, all }
     */
    setRecordType(type) {
      this.recordType = type;
    },

    /**
     * 下拉加载更多用户歌单
     */
    async loadMore() {
      await this._getUserPlaylist();
    },

    /**
     * 获取用户听歌记录
     */
    async _getUserRecord() {
      /**
       * 开始加载记录
       */
      this.isLoadingRecord = true;

      /**
       * 加载
       */
      await getUserRecord({ id: this.curUserId, type: this.recordType })
        .then((res) => {
          if (res.data && res.data.code === 200) {
            this.authorized = true;

            /**
             * 存取用户听歌记录数据
             */
            this.records = !!this.recordType
              ? res.data.weekData
              : res.data.allData;
          }

          /**
           * 加载完毕
           */
          this.isLoadingRecord = false;
        })
        .catch((e) => {
          /**
           * 加载完毕
           */
          this.isLoadingRecord = false;
        });
    },

    /**
     * 获取用户歌单数据
     */
    async _getUserPlaylist() {
      /**
       * 如果没有更多数据，则不发送请求
       */
      if (!this.more) {
        return;
      }

      await getUserPlaylist({
        id: this.curUserId,
        /**
         * 每次请求30条数据
         */
        offset: this.playlistOffset * 30,
      })
        .then(({ data: { more, playlist } }) => {
          /**
           * 暂存用户歌单数据
           */
          let createdPlaylist = [];

          /**
           * 暂存用户收藏歌单数据
           */
          let collectedPlaylist = [];

          playlist.map((item) => {
            if (Number(item.userId) === Number(this.curUserId)) {
              createdPlaylist = [...createdPlaylist, item];
            } else {
              collectedPlaylist = [...collectedPlaylist, item];
            }
          });

          /**
           * 存储用户创建歌单列表
           */
          this.createdPlaylist = [...this.createdPlaylist, ...createdPlaylist];

          /**
           * 存储用户收藏歌单列表
           */
          this.collectedPlaylist = [
            ...this.collectedPlaylist,
            ...collectedPlaylist,
          ];

          /**
           * 记录是否拥有更多数据
           */
          this.more = more;

          /**
           * 偏移量加1
           */
          this.playlistOffset += 1;
        })
        .catch((e) => {
          this.$toast.failed("加载发生了错误！");
        });
    },
  },

  created() {
    /**
     * 实例属性，是否还有未加载的歌单数据
     */
    this.more = true;

    /**
     * 实例属性，用户创建歌单的偏移量 用于下拉加载
     */
    this.playlistOffset = 0;

    /**
     * 实例属性，存取页面对应用户Id
     */
    this.curUserId = this.$route.query.id;

    /**
     * 获取用户听歌记录
     */
    this._getUserRecord();

    /**
     * 获取用户歌单数据
     */
    this._getUserPlaylist();
  },

  /**
   * 路由参数变化时触发，初始化页面
   */
  async beforeRouteUpdate(to, from, next) {
    /**
     * 初始化所有数据
     */
    this.more = true;

    this.playlistOffset = 0;

    this.authorized = false;

    this.recordType = 1;

    this.records = null;

    this.isLoadingRecord = false;

    this.createdPlaylist = [];

    this.collectedPlaylist = [];

    this.curUserId = to && to.query && to.query.id;

    /**
     * 获取用户听歌记录
     */
    await this._getUserRecord();

    /**
     * 获取用户歌单数据
     */
    await this._getUserPlaylist();

    next();
  },

  components: {
    Profile,
    SongRecord,
    PlaylistSummary,
    Loading,
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

.usr-info {
  .usr-main {
    width: 900px;
    margin: 0 auto;
    padding: 40px;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;

    .m-record-title {
      position: relative;
      height: 33px;
      border-bottom: 2px solid #c20c0c;

      h3 {
        font-size: 20px;
        line-height: 28px;
        float: left;
        font-weight: normal;
        color: #666;
      }

      h4 {
        float: left;
        margin-top: 5px;
        margin-left: 10px;
        line-height: 26px;
        font-size: 12px;
        font-weight: 400;
        color: #666;
      }

      .point {
        position: relative;
        margin-left: 10px;
        left: -1px;
        top: 8px;
        line-height: 18px;
        z-index: 2;

        &:hover {
          .tip {
            display: block;
          }
        }

        .icn-tip {
          display: inline-block;
          width: 18px;
          height: 18px;
          background: url("~@/assets/images/Common/icon2.png");
          background-position: 0 -50px;
          overflow: hidden;
          vertical-align: middle;
          cursor: pointer;

          &:hover {
            background-position: -20px -50px;
          }
        }

        .tip {
          position: absolute;
          left: -33px;
          top: 30px;
          display: none;
          width: 295px;
          font-size: 12px;
          line-height: 20px;
          padding: 8px 19px 7px 19px;
          background: url("~@/assets/images/Common/top_m.png");
          z-index: 2;
          color: #666;

          .t {
            position: absolute;
            width: 327px;
            height: 16px;
            left: 0;
            top: -16px;
            background: url("~@/assets/images/Common/top_t.png");
          }

          .b {
            position: absolute;
            width: 327px;
            height: 12px;
            left: 0;
            bottom: -12px;
            background: url("~@/assets/images/Common/top_b.png");
          }
        }
      }

      .nav {
        position: absolute;
        z-index: 1;
        right: 0;
        bottom: 5px;

        span {
          float: right;
          margin-left: 8px;
          line-height: 26px;
          font-size: 12px;
          color: #666;
          cursor: pointer;
        }

        i {
          float: right;
          margin-left: 8px;
          width: 1px;
          height: 12px;
          margin-top: 7px;
          background-color: #999;
        }

        .z-sel {
          color: #333;
          font-weight: 700;
        }
      }
    }

    .m-record {
      position: relative;
      margin-bottom: 36px;

      .more {
        height: 32px;
        line-height: 32px;
        text-align: right;

        a {
          color: #666;
          font-size: 12px;
          cursor: pointer;
          text-decoration: none;
        }
      }
    }

    .n-record {
      padding: 105px 0 105px 0;
      text-align: center;

      h3 {
        padding-bottom: 38px;
        font-size: 18px;
        font-weight: bold;

        .icn-norecord {
          display: inline-block;
          margin-right: 17px;
          width: 64px;
          height: 50px;
          overflow: hidden;
          vertical-align: middle;
          background: url("~@/assets/images/Common/icon.png");
          background-position: 0 -347px;
        }
      }
    }

    .cl-title {
      height: 33px;
      border-bottom: 2px solid #c20c0c;

      h3 {
        font-size: 20px;
        line-height: 28px;
        float: left;
        font-weight: normal;

        .f-pr {
          position: relative;
          zoom: 1;
        }
      }
    }

    .c-lst {
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;

      .c-itm {
        padding: 0 0 10px 50px;
        box-sizing: unset;
      }

      .fst {
        padding-left: 0px;
      }
    }
  }
}
</style>
