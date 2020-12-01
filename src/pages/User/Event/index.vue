<template>
  <!-- 用户动态页 -->
  <div class="usr-evt">
    <!-- 用户基础信息 -->
    <Profile :isUuId="isUuId" />

    <div v-if="userInfo">
      <!-- 动态 标题 -->
      <div class="title">
        <h3>
          <span class="f-pr">
            {{ isUuId ? "我" : "TA" }}的动态（{{
              userInfo.profile.eventCount
            }}）
          </span>
        </h3>
      </div>

      <div class="cnt">
        <!-- 动态 -->
        <div class="evt">
          <!-- 无动态 -->
          <div v-if="!userInfo.profile.eventCount" class="nevt">
            <h3><i class="icn-nevt"></i>暂时还没有动态</h3>
          </div>

          <!-- 动态区 -->
          <div else>
            <Event
              v-for="event of events"
              :key="event.id"
              :originEvent="event"
              :isUuId="isUuId"
            />
          </div>
        </div>

        <!-- 关注 粉丝 -->
        <div class="follow">
          <h4>{{ isUuId ? "我" : "TA" }}的关注</h4>

          <!-- 关注列表 -->
          <ul class="f-list" v-if="follows.length">
            <li v-for="follow of follows" :key="follow.userId">
              <router-link
                :to="`/user/info?id=${follow.userId}`"
                :title="follow.nickname"
              >
                <img :src="follow.avatarUrl" />
              </router-link>

              <p>
                <router-link
                  class="nm"
                  :to="`/user/info?id=${follow.userId}`"
                  :title="follow.nickname"
                >
                  {{ follow.nickname }}
                </router-link>
              </p>
            </li>
          </ul>

          <h4>{{ isUuId ? "我" : "TA" }}的粉丝</h4>

          <!-- 粉丝列表 -->
          <ul class="f-list" v-if="followeds.length">
            <li v-for="followed of followeds" :key="followed.userId">
              <router-link
                :to="`/user/info?id=${followed.userId}`"
                :title="followed.nickname"
              >
                <img :src="followed.avatarUrl" />
              </router-link>

              <p>
                <router-link
                  class="nm"
                  :to="`/user/info?id=${followed.userId}`"
                  :title="followed.nickname"
                >
                  {{ followed.nickname }}
                </router-link>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Profile from "@/components/Profile";
import Event from "@/components/Event";
import { userMixin } from "@/mixins";
import {
  getUserDetail,
  getUserFollows,
  getUserFolloweds,
  getUserEvents,
} from "@/apis/user";

export default {
  mixins: [userMixin],

  data() {
    return {
      /**
       * 关注列表
       */
      follows: [],

      /**
       * 粉丝列表
       */
      followeds: [],

      /**
       * 用户动态列表
       */
      events: [],
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

  methods: {
    /**
     * 初始化数据
     */
    _initPage() {
      Promise.all([
        getUserFollows({ id: this.curUserId, limit: 6 }),
        getUserFolloweds({ id: this.curUserId, limit: 6 }),
        getUserEvents({ id: this.curUserId, limit: 20 }),
      ])
        .then(
          ([
            {
              data: { follow },
            },
            {
              data: { followeds },
            },
            { data },
          ]) => {
            this.follows = follow;
            this.followeds = followeds;
            this.events = data.events;
          }
        )
        .catch((e) => this.$toast.failed(e.toString()));
    },
  },

  created() {
    /**
     * 实例属性，存取页面对应用户Id
     */
    this.curUserId = this.$route.query.id;

    this._initPage();
  },

  /**
   * 路由参数变化时触发，初始化页面
   */
  beforeRouteUpdate(to, from, next) {
    /**
     * 初始化所有数据
     */
    this.curUserId = to && to.query && to.query.id;

    this._initPage();

    next();
  },

  components: {
    Profile,
    Event,
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

.usr-evt {
  width: 900px;
  margin: 0 auto;
  padding: 40px;
  border: 1px solid #d3d3d3;
  border-width: 0 1px;

  .title {
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

  .cnt {
    display: flex;
    min-height: 700px;
    background: url("~@/assets/images/Common/wrap1.png") repeat-y 100% 100%;

    .evt {
      flex: 1;
      padding: 10px 25px 0 0;

      .nevt {
        padding: 105px 0 105px 0;
        text-align: center;

        h3 {
          font-weight: normal;
          margin-top: -2px;
          padding-bottom: 38px;
          font-size: 18px;
          color: #333;

          .icn-nevt {
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
    }

    .follow {
      box-sizing: border-box;
      padding: 10px 0 0 25px;
      width: 250px;

      h4 {
        height: 23px;
        border-bottom: 1px solid #ccc;
        color: #333;
        font-size: 12px;
        font-weight: bold;
      }

      .f-list {
        margin: 15px 0 0 -16px;

        &:after {
          clear: both;
          content: ".";
          display: block;
          height: 0;
          visibility: hidden;
        }

        li {
          float: left;
          width: 64px;
          height: 105px;
          padding-left: 16px;
          list-style: none;

          img {
            display: block;
            width: 64px;
            height: 64px;
          }

          p {
            margin-top: 5px;

            .nm {
              display: inline-block;
              max-width: 100%;
              font-size: 12px;
              color: #333;
              @include word-hide;
            }
          }
        }
      }
    }
  }
}
</style>