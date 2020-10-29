<template>
  <div class="usr-hm">
    <div class="usr-main" v-if="userInfo">
      <!-- 用户基础信息 -->
      <div class="usr-prf">
        <!-- 用户头像 -->
        <div class="usr-pic">
          <img :src="userInfo.profile.avatarUrl" />
        </div>

        <!-- 用户简介 -->
        <div class="usr-info">
          <!-- 用户名 等级 私信 关注等-->
          <div class="name">
            <!-- 所有用户（包括登录用户）都会显示的信息 名字 等级 -->
            <h2 class="name-wrp">
              <span class="tit">
                {{ userInfo.profile.nickname }}
              </span>
              <span class="lev">
                {{ userInfo.level }}
                <i class="icn-lev"></i>
              </span>
            </h2>

            <!-- 登录用户显示编辑资料按钮 -->
            <span class="u-btn-e" v-if="isUuId">
              <i>编辑个人资料</i>
            </span>

            <!-- 访问其它用户显示的信息 -->
            <div class="oth-u" v-else>
              <!-- 用户性别 0代表保密 1男 2女-->
              <i
                v-if="!!userInfo.profile.gender"
                :class="[
                  'icn-gender',
                  {
                    'icn-male': userInfo.profile.gender === 1,
                    'icn-female': userInfo.profile.gender === 2,
                  },
                ]"
              ></i>

              <!-- 私信按钮 -->
              <span class="u-btn-s">
                <i>发私信</i>
              </span>

              <!-- 关注按钮 -->
              <span class="u-btn-f"> 关 注 </span>
            </div>
          </div>

          <!-- 动态 关注 粉丝 -->
          <ul class="tab-box">
            <!-- 动态数 -->
            <li class="fst">
              <router-link to="#">
                <strong>{{ userInfo.profile.eventCount }}</strong>
                <span>动态</span>
              </router-link>
            </li>

            <!-- 关注数 -->
            <li>
              <router-link to="#">
                <strong>{{ userInfo.profile.follows }}</strong>
                <span>关注</span>
              </router-link>
            </li>

            <!-- 粉丝数 -->
            <li>
              <router-link to="#">
                <strong>{{ userInfo.profile.followeds }}</strong>
                <span>粉丝</span>
              </router-link>
            </li>
          </ul>

          <!-- 个人介绍 -->
          <div
            v-if="userInfo.profile && userInfo.profile.signature"
            class="inf s-fc"
          >
            个人介绍：{{ userInfo.profile.signature }}
          </div>

          <!-- 年龄 -->
          <div
            v-if="userInfo.profile && userInfo.profile.birthday"
            class="inf s-fc"
          >
            年龄：{{ _formatMsToYears(userInfo.profile.birthday) }}
          </div>
        </div>
      </div>

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

        <!-- 加载状态 -->
        <Loading v-if="isLoadingRecord" />
      </div>

      <div v-dropload="loadMore">
        <!-- 用户创建歌单 标题 -->
        <div class="cl-title" v-if="createdPlaylist.length">
          <h3>
            <span class="f-pr">
              {{ isUuId ? '我' : userInfo.profile.nickname }}创建的歌单（{{
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
              {{ isUuId ? '我' : userInfo.profile.nickname }}收藏的歌单（{{
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
import SongRecord from '@/components/SongRecord';
import Loading from '@/components/Loading';
import PlaylistSummary from '@/components/PlaylistSummary';
import { userMixin } from '@/mixins';
import { getUserDetail, getUserRecord, getUserPlaylist } from '@/apis/user';
import { formatMsToYears } from '^/formatMsToYears';

export default {
  mixins: [userMixin],
  data() {
    return {
      /**
       * 用户数据
       * type  {
       *
       *  //用户等级
       * 	level: 0,
       *
       *  //用户简介
       * 	profile: {},
       */
      userInfo: null,

      /**
       * 当前页面的对应的用户Id
       */
      curUserId: '',

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
     * 根据出生的 ms 计算年代
     */
    _formatMsToYears(ms) {
      return formatMsToYears(ms);
    },

    /**
     * 获取用户信息
     */
    _getUserDetail() {
      /**
       * 根据id获取用户信息，报错时跳转到 404
       */
      getUserDetail({ id: this.curUserId })
        .then(({ data }) => {
          this.userInfo = data;
        })
        .catch((e) => {
          this.$router.push({
            path: '/404',
          });
        });
    },

    /**
     * 获取用户听歌记录
     */
    _getUserRecord() {
      /**
       * 开始加载记录
       */
      this.isLoadingRecord = true;

      /**
       * 加载
       */
      getUserRecord({ id: this.curUserId, type: this.recordType })
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
          this.$toast.failed('加载发生了错误！');
        });
    },
  },

  created() {
    /**
     * 是否还有未加载的歌单数据
     */
    this.more = true;

    /**
     * 用户创建歌单的偏移量 用于下拉加载
     */
    this.playlistOffset = 0;

    /**
     * 加载时判断路由中是否有 id，无id跳转 404页面
     */
    if (!this.$route.query.id) {
      this.$router.push({
        path: '/404',
      });

      return;
    }

    /**
     * 存取页面对应用户Id
     */
    this.curUserId = this.$route.query.id;

    /**
     * 根据id获取用户信息，报错时跳转到 404
     */
    this._getUserDetail();

    /**
     * 获取用户听歌记录
     */
    this._getUserRecord();

    /**
     * 获取用户歌单数据
     */
    this._getUserPlaylist();
  },

  components: {
    SongRecord,
    PlaylistSummary,
    Loading,
  },
};
</script>

<style lang="scss" scoped>
@import '#/scss/global.scss';

.usr-hm {
  .usr-main {
    width: 900px;
    margin: 0 auto;
    padding: 40px;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;

    .usr-prf {
      margin-bottom: 43px;
      display: flex;

      .usr-pic {
        width: 188px;
        margin-right: 40px;

        img {
          display: block;
          width: 180px;
          height: 180px;
          padding: 3px;
          background: #fff;
          border: 1px solid #d5d5d5;
        }
      }

      .usr-info {
        flex: 1;

        .name {
          display: flex;
          align-items: center;
          padding-bottom: 12px;
          margin-bottom: 10px;
          border-bottom: 1px solid #ddd;

          .name-wrp {
            .tit {
              margin-top: 3px;
              font-size: 22px;
              font-weight: normal;
              line-height: 30px;
            }

            .lev {
              margin: 8px 0 0 10px;
              display: inline-flex;
              align-items: center;
              height: 19px;
              overflow: hidden;
              padding-left: 29px;
              line-height: 21px;
              color: #e03a24;
              font-size: 14px;
              font-weight: bold;
              font-style: italic;
              background: url('~@/assets/images/Common/icon2.png') no-repeat 0
                9999px;
              background-position: -135px -190px;
              word-break: break-word;

              .icn-lev {
                position: relative;
                left: 3px;
                width: 12px;
                height: 19px;
                background: url('~@/assets/images/Common/icon2.png');
                background-position: -191px -190px;
                display: inline-block;
                overflow: hidden;
                font-style: normal;
                text-align: left;
                font-size: inherit;
              }
            }
          }

          .oth-u {
            display: flex;
            margin-left: 8px;

            .icn-gender {
              display: block;
              width: 20px;
              height: 20px;
              margin-top: 9px;
              background: url('~@/assets/images/Common/icon.png');
            }

            .icn-male {
              background-position: -41px -57px;
            }

            .icn-female {
              background-position: -41px -27px;
            }

            .u-btn-s {
              display: inline-block;
              margin: 4px 0 0 15px;
              width: 75px;
              height: 31px;
              background: url('~@/assets/images/Common/button.png');
              background-position: 0 -810px;
              text-decoration: none;
              cursor: pointer;

              i {
                display: inline-block;
                height: 29px;
                line-height: 29px;
                padding-left: 30px;
                font-style: normal;
                text-align: left;
                font-size: 12px;
                cursor: pointer;
              }

              &:hover,
              &:active {
                outline: none;
                background-position: 0 -845px;
              }
            }

            .u-btn-f {
              display: inline-block;
              margin: 4px 0 0 15px;
              width: 40px;
              height: 31px;
              padding-left: 30px;
              color: #fff;
              line-height: 30px;
              font-size: 12px;
              background: url('~@/assets/images/Common/button.png');
              background-position: 0 -720px;
              cursor: pointer;

              &:hover,
              &:active {
                background-position: -80px -720px;
              }
            }
          }

          .u-btn-e {
            margin: 4px 0 0 15px;
            padding: 0 5px 0 0;
            display: inline-block;
            height: 31px;
            line-height: 31px;
            overflow: hidden;
            vertical-align: top;
            text-align: center;
            outline: none;
            font-size: 12px;
            color: #333;
            background: url('~@/assets/images/Common/button2.png') no-repeat 0
              9999px;
            background-position: right -100px;
            text-decoration: none;
            cursor: pointer;

            &:hover,
            &:active {
              background-position: right -182px;
            }

            i {
              display: inline-block;
              padding: 0 15px 0 20px;
              height: 31px;
              line-height: 31px;
              overflow: hidden;
              vertical-align: top;
              text-align: center;
              font-style: normal;
              background: url('~@/assets/images/Common/button2.png') no-repeat 0
                9999px;
              background-position: 0 -59px;
              cursor: pointer;

              &:hover,
              &:active {
                background-position: 0 -141px;
              }
            }
          }
        }

        .tab-box {
          height: 41px;
          margin-bottom: 15px;
          color: #666;

          li {
            float: left;
            padding: 0 40px 0 20px;
            border-left: 1px solid #ddd;
          }

          a {
            display: inline-block;
            position: relative;
            zoom: 1;
            color: #666;
            text-decoration: none;
            list-style: none;

            &:hover {
              color: #0c73c2;
            }
          }

          strong {
            display: block;
            margin-top: -4px;
            margin-bottom: 6px;
            font-size: 24px;
            font-weight: normal;
            cursor: pointer;
          }

          span {
            display: block;
            font-size: 12px;
            text-indent: 2px;
            cursor: pointer;
          }

          .fst {
            padding-left: 0;
            border-left: none;
          }
        }

        .inf {
          margin-bottom: 5px;
          line-height: 21px;
          font-size: 12px;
          color: #666;
        }
      }
    }

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
          background: url('~@/assets/images/Common/icon2.png');
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
          background: url('~@/assets/images/Common/top_m.png');
          z-index: 2;
          color: #666;

          .t {
            position: absolute;
            width: 327px;
            height: 16px;
            left: 0;
            top: -16px;
            background: url('~@/assets/images/Common/top_t.png');
          }

          .b {
            position: absolute;
            width: 327px;
            height: 12px;
            left: 0;
            bottom: -12px;
            background: url('~@/assets/images/Common/top_b.png');
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
