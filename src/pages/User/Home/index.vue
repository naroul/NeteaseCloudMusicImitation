<template>
  <!-- 用户板块主页 -->
  <div id="user-home">
    <router-view></router-view>
  </div>
</template>

<script>
import { headerMixin, userMixin } from "@/mixins";
import { getUserDetail } from "@/apis/user";

export default {
  mixins: [headerMixin, userMixin],

  methods: {
    /**
     * 获取用户信息
     */
    async _getUserDetail() {
      /**
       * 根据id获取用户信息，报错时跳转到 404
       */
      await getUserDetail({ id: this.curUserId })
        .then(({ data }) => {
          this.setUserInfo(data);
        })
        .catch((e) => {
          this.$router.push({
            path: "/404",
          });
        });
    },
  },

  created() {
    /**
     * 加载时判断路由中是否有 id，无id跳转 404页面
     */
    if (!this.$route.query.id) {
      this.$router.push({
        path: "/404",
      });

      return;
    }

    /**
     * 实例属性，存取页面对应用户Id
     */
    this.curUserId = this.$route.query.id;

    /**
     * 获取用户数据
     */
    this._getUserDetail();
  },

  /**
   * 加载前设置header不显示navs
   */
  beforeMount() {
    this.setIsShowHeaderNavs(false);
  },

  /**
   * 路由参数变化时触发，初始化页面
   */
  async beforeRouteUpdate(to, from, next) {
    /**
     * 加载时判断路由中是否有 id，无id跳转 404页面
     */
    if (!to.query.id) {
      this.$router.push({
        path: "/404",
      });

      return;
    }

    /**
     * 实例属性 存储当前页对应的用户id
     */
    this.curUserId = to && to.query && to.query.id;

    /**
     * 获取用户数据
     */
    await this._getUserDetail();

    next();
  },
};
</script>

<style></style>
