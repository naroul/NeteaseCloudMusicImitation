<template>
  <!-- 用户动态页 -->
  <div class="usr-evt">
    <!-- 用户基础信息 -->
    <Profile :isUuId="isUuId" />
  </div>
</template>

<script>
import Profile from "@/components/Profile";
import { userMixin } from "@/mixins";
import { getUserDetail } from "@/apis/user";

export default {
  mixins: [userMixin],

  data() {
    return {};
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

  methods: {},

  created() {
    /**
     * 实例属性，存取页面对应用户Id
     */
    this.curUserId = this.$route.query.id;
  },

  /**
   * 路由参数变化时触发，初始化页面
   */
  beforeRouteUpdate(to, from, next) {
    /**
     * 初始化所有数据
     */
    this.curUserId = to && to.query && to.query.id;

    next();
  },

  components: {
    Profile,
  },
};
</script>

<style lang="scss" scoped>
.usr-evt {
  width: 900px;
  margin: 0 auto;
  padding: 40px;
  border: 1px solid #d3d3d3;
  border-width: 0 1px;
}
</style>