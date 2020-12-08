<template>
  <!-- 总页面 -->
  <div id="home">
    <Header />
    <router-view></router-view>
    <Login v-if="isShowLoginDialog" />
    <Player />
  </div>
</template>

<script>
import { getLoginStatus } from "@/apis/header";
import Header from "@/components/Header";
import Login from "@/components/Login";
import Player from "@/components/Player";
import { loginMixin, userMixin } from "@/mixins";

export default {
  mixins: [loginMixin, userMixin],

  created() {
    /**
     * 获取登录状态并保存到vuex中
     */
    getLoginStatus()
      .then(({ data }) => {
        /**
         * 设置登录状态
         */
        this.setLoginStatus(true);

        /**
         * 保存登录用户 id
         */
        this.setUuId(data.profile.userId);
      })
      .catch((e) => {
        this.setLoginStatus(false);
      });
  },

  components: {
    Header,
    Login,
    Player,
  },
};
</script>

<style></style>
