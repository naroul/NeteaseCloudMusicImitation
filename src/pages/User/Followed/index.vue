<template>
  <div class="usr-fld">
    <!-- 用户基础信息 -->
    <Profile :isUuId="isUuId" />

    <!-- 动态 标题 -->
    <div class="title" v-if="userInfo">
      <h3>
        <span class="f-pr"> 粉丝（{{ userInfo.profile.followeds }}） </span>
      </h3>
    </div>

    <!-- 关注列表 -->
    <ul class="follows">
      <li
        :class="[
          'follow',
          { odd: index % 2 === 1 },
          { last: index > followeds.length - 3 },
        ]"
        v-for="(followed, index) of followeds"
      >
        <Resume :profile="followed" :width="index % 2 === 1 ? 408 : 409" />
      </li>
    </ul>
  </div>
</template>

<script>
import Profile from "@/components/Profile";
import Resume from "@/components/Resume";
import { userMixin } from "@/mixins";
import { getUserFolloweds } from "@/apis/user";

export default {
  mixins: [userMixin],

  data() {
    return {
      /**
       * 关注列表
       */
      followeds: [],
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
     * 加载数据初始化页面
     */
    _initPage() {
      getUserFolloweds({ id: this.curUserId, limit: 100 }).then(({ data }) => {
        this.followeds = data.followeds;
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
  },
};
</script>

<style lang="scss" scoped>
.usr-fld {
  width: 900px;
  margin: 0 auto;
  padding: 40px;
  border: 1px solid #d3d3d3;
  border-width: 0 1px 1px 1px;

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