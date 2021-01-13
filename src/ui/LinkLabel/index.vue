<template>
  <!-- 标签组件 用于跳转各种页面 -->
  <span
    class="label"
    :style="{
      color,
      fontSize: size,
    }"
    @click="linkTo"
  >
    <slot></slot>
  </span>
</template>

<script>
export default {
  props: {
    /**
     * 要跳转到的页面对应id
     */
    id: {
      type: [String, Number],
      reuired: true,
      default: 0,
    },

    /**
     * 标签跳转类型
     */
    type: {
      validator(value) {
        return [
          /**
           * 跳转歌曲详情页
           */
          "song",

          /**
           * 跳转歌手详情页
           */
          "artist",

          /**
           * 跳转歌单详情页
           */
          "musiclist",

          /**
           * 跳转用户信息页
           */
          "user",
        ].includes(value);
      },
      required: true,
      default: "song",
    },

    /**
     * 字体大小
     */
    size: {
      type: [Number, String],
      required: false,
    },

    /**
     * 字体颜色
     */
    color: {
      type: String,
      required: false,
    },
  },

  methods: {
    /**
     * 跳转逻辑
     */
    linkTo() {
      const { id, type } = this;

      switch (type) {
        case "user":
          this.$router.push(`/user/info?id=${id}`);
          break;

        default:
          this.$router.push(`/music/${type}?id=${id}`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>