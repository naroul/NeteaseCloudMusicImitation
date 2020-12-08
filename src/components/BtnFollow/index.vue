<template>
  <!-- 关注按钮	 -->
  <span
    :class="[
      'btn',
      {
        'btn-f': isFollowed,
        'btn-unf': !isFollowed,
      },
    ]"
  >
    <span @click="followCtrl">
      <!-- 鼠标 hover时显示 -->
      <span class="unhover">{{ isFollowed ? "已关注" : "关注" }}</span>

      <!-- 鼠标 hover时显示 -->
      <span class="hover">{{ isFollowed ? "取消关注" : "关注" }}</span>
    </span>
  </span>
</template>

<script>
import { userMixin } from "@/mixins";
import { follow, unfollow } from "@/apis/user";

export default {
  mixins: [userMixin],

  props: {
    /**
     * 关联的用户id
     */
    id: {
      type: [String, Number],
      required: true,
      default: "",
    },

    /**
     * 是否被登录用户已关注
     */
    followed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  data() {
    return {
      /**
       * 关注状态
       */
      isFollowed: false,
    };
  },

  methods: {
    /**
     * 关注 / 取消关注
     */
    followCtrl() {
      if (this.isFollowed) {
        unfollow({ id: this.id }).then(() => {
          /**
           * 取消关注
           */
          this.isFollowed = false;
        });
      } else {
        follow({ id: this.id }).then(() => {
          /**
           * 添加关注
           */
          this.isFollowed = true;
        });
      }
    },
  },

  created() {
    /**
     * 赋值初始值
     */
    this.isFollowed = this.followed;
  },
};
</script>

<style lang="scss" scoped>
.btn {
  display: inline-block;
  margin: 4px 0 0 15px;
  height: 31px;
  line-height: 30px;
  font-size: 12px;
  background: url("~@/assets/images/Common/button.png");
  cursor: pointer;

  .hover {
    display: none;
  }
}

.btn-f {
  width: 70px;
  color: #000;
  text-align: center;
  background-position: 0 -760px;

  &:hover,
  &:active {
    .unhover {
      display: none;
    }

    .hover {
      display: inline;
    }
  }
}

.btn-unf {
  width: 40px;
  padding-left: 30px;
  background-position: 0 -720px;
  color: #fff;

  &:hover,
  &:active {
    background-position: -80px -720px;
  }
}
</style>