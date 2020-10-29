<template>
  <div v-once class="notfound-wrapper">
    <canvas ref="canvas"></canvas>
    <img :src="url" class="image" />
    <router-link to="/" class="exit">返回主页</router-link>
  </div>
</template>

<script>
import image from "#/images/NotFound/404.jpg";

export default {
  data() {
    return {
      url: image,
    };
  },

  methods: {
    /**
     * 绘制404警告文字
     */
    drawText() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");

      canvas.width = 500;
      canvas.height = 60;

      /**
       * 文字样式：加粗 60像素 字体Arial
       */
      ctx.font = "bold 58px Arial";

      /**
       * 字体颜色
       */
      ctx.fillStyle = "#505050";

      /**
       * 绘图基线
       */
      ctx.textBaseline = "hanging";
      ctx.fillText("404 Not Found", 0, 0);
    },
  },

  mounted() {
    this.drawText();
  },
};
</script>

<style lang="scss" scoped>
.notfound-wrapper {
  position: absolute;
  top: -200px;
  right: 0;
  bottom: 0;
  left: -200px;
  margin: auto;
  width: 200px;
  height: 200px;

  .image {
    width: 400px;
    border-radius: 200px;
  }

  .exit {
    position: fixed;
    top: 50px;
    right: 100px;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    background: rgb(243, 119, 119);
    font-size: 0;
    overflow: hidden;
    line-height: 20px;
    transition: all 0.5s;

    &:hover {
      top: 35px;
      right: 85px;
      width: 50px;
      height: 50px;
      line-height: 50px;
      font-size: 12px;
      color: rgb(250, 207, 207);
      background: rgba(243, 119, 119, 0.8);
    }
  }
}
</style>
