<template>
  <div class="usr-fl">
    <!-- 用户基础信息 -->
    <Profile :isUuId="isUuId" />

    <!-- 动态 标题 -->
    <div class="title" v-if="userInfo">
      <h3>
        <span class="f-pr"> 关注（{{ userInfo.profile.follows }}） </span>
      </h3>
    </div>

    <!-- 关注列表 -->
    <ul class="follows">
      <li
        :class="[
          'follow',
          { odd: index % 2 === 1 },
          { last: index > follows.length - 3 },
        ]"
        v-for="(follow, index) of follows"
      >
        <Resume :profile="follow" :width="index % 2 === 1 ? 408 : 409" />
      </li>

      <!-- 加载状态 -->
      <Loading v-if="isLoading" />
    </ul>

    <Pagination v-if="pgSize !== 0" :pgSize="pgSize" @pgChange="onPgChange" />
  </div>
</template>

<script>
import Profile from "@/components/Profile";
import Loading from "@/components/Loading";
import Resume from "@/components/Resume";
import Pagination from "@/components/Pagination";
import { userMixin } from "@/mixins";
import { getUserFollows } from "@/apis/user";

export default {
  mixins: [userMixin],

  data() {
    return {
      /**
       * 关注列表
       */
      follows: [],

      /**
       * 加载状态
       */
      isLoading: false,
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

    /**
     * 分页的总页数
     */
    pgSize() {
      /**
       * 当未读取到数据或者动态少于20条时，不显示分页
       */
      if (!this.userInfo || this.userInfo.profile.follows <= 20) {
        return 0;
      }

      const pgSize = parseInt(this.userInfo.profile.follows / 20);
      if (this.userInfo.profile.follows % 20 === 0) {
        return pgSize;
      } else {
        return pgSize + 1;
      }
    },
  },

  methods: {
    /**
     * 分页，页数改变
     */
    onPgChange(page) {
      /**
       * 设置加载中
       */
      this.isLoading = true;

      /**
       * 请求分页数据
       */
      getUserFollows({
        id: this.curUserId,
        limit: 20,
        offset: (page - 1) * 20,
      }).then(({ data }) => {
        /**
         * 加载完毕
         */
        this.isLoading = false;

        /**
         * 更新数据
         */
        this.follows = data.follow;
      });
    },

    /**
     * 加载数据初始化页面
     */
    _initPage() {
      getUserFollows({ id: this.curUserId, limit: 20 }).then(({ data }) => {
        this.follows = data.follow;
      });
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
    Resume,
    Loading,
    Pagination,
  },
};
</script>

<style lang="scss" scoped>
.usr-fl {
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

  .follows {
    position: relative;
    border-left: 1px solid #d5d5d5;
    border-bottom: 1px solid #d5d5d5;

    &::after {
      clear: both;
      content: ".";
      display: block;
      height: 0;
      visibility: hidden;
    }

    .follow {
      float: left;
      width: 409px;
      height: 80px;
      padding: 20px 20px 0 20px;
      border-right: 1px solid #d5d5d5;
    }

    .odd {
      width: 408px;
    }

    .last {
      border-bottom: 1px solid #d5d5d5;
    }
  }
}
</style>