<template>
  <div v-once class="wrapper">
    <canvas ref="canvas"></canvas>
    <img :src="url" class="image" />
  </div>
</template>

<script>
import image from '#/NotFound/404.jpg';

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
      const ctx = canvas.getContext('2d');

      canvas.width = 500;
      canvas.height = 60;

      /**
       * 文字样式：加粗 60像素 字体Arial
       */
      ctx.font = 'bold 58px Arial';

      /**
       * 字体颜色
       */
      ctx.fillStyle = '#505050';

      /**
       * 绘图基线
       */
      ctx.textBaseline = 'hanging';
      ctx.fillText('404 Not Found', 0, 0);
    },
  },

  mounted() {
    this.drawText();
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
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
}
</style>
