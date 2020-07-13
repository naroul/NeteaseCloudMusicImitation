<template>
  <div class="banner-wrapper" :style="backImgStyle">
    <div class="banner">
      <img :src="imgUrl" />
    </div>
  </div>
</template>

<script>
import { timer } from '^/timer';

export default {
  props: {
    /**
     * 轮播图数据
     */
    banners: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  data() {
    return {
      /**
       * 轮播图的序号
       */
      bannerIndex: 0,
    };
  },

  computed: {
    /**
     * 轮播图图片url
     */
    imgUrl() {
      return this.banners[this.bannerIndex].imageUrl + '?imageView&quality=89';
    },

    /**
     * 轮播图背景图片url
     */
    backImgStyle() {
      return {
        'background-image': `url(${
          this.banners[this.bannerIndex].imageUrl
        }?imageView&blur=40x20)`,
        'background-size': '6000px',
        'background-position': 'center center',
      };
    },
  },

  methods: {
    /**
     * 自动轮播 切换轮播图
     */
    autoSwitch() {
      /**
       * 当轮播到最后一张，或者出错导致索引大于轮播图数量时，切换到第一张轮播图
       * 正常情况每3s切换下一张图
       */
      const stop = timer(() => {
        if (
          this.bannerIndex === this.banners.length - 1 ||
          this.bannerIndex > this.banners.length
        ) {
          this.bannerIndex = 0;
        } else {
          this.bannerIndex++;
        }
      }, 3000);

      return stop;
    },
  },

  created() {
    /**
     * 将该定时器清除器存储到变量中以便其它生命周期中调用
     */
    this.stop = this.autoSwitch();
  },

  beforeDestroy() {
    /**
     * 清除定时器
     */
    this.stop();
  },
};
</script>

<style lang="scss" scoped>
.banner-wrapper {
  .banner {
    width: 730px;
    margin: 0 auto;
    font-size: 0;
    z-index: 10;

    img {
      display: block;
      width: 730px;
    }
  }
}
</style>
