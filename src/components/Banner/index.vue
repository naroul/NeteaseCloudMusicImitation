<template>
  <div class="banner-wrapper" :style="backImgStyle">
    <div class="banner">
      <div class="left-switch-arrow" @click="switchPre">
        <i class="iconfont icon-arrow-lift" />
      </div>
      <img :src="imgUrl" />
      <div class="dots">
        <div v-for="(banner, index) of banners" class="dot-wrapper">
          <li :class="['dot', { 'dot-active': index === bannerIndex }]"></li>
        </div>
      </div>
      <div class="right-switch-arrow" @click="switchNext">
        <i class="iconfont icon-arrow-right" />
      </div>
    </div>
  </div>
</template>

<script>
import { timer } from "^/timer";

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
      return this.banners[this.bannerIndex].imageUrl + "?imageView&quality=89";
    },

    /**
     * 轮播图背景图片url
     */
    backImgStyle() {
      return {
        "background-image": `url(${
          this.banners[this.bannerIndex].imageUrl
        }?imageView&blur=40x20)`,
        "background-size": "6000px",
        "background-position": "center center",
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

    /**
     * 切换上一张轮播图
     */
    switchPre() {
      /**
       * 先停止自动轮播 防止点击后瞬间切换下一张图片
       */
      this.stop();

      /**
       * 清除上次的定时器
       */
      clearTimeout(this.timeout);
      this.timeout = null;

      /**
       * 切换到上一张图片
       * 切换到第一张时，切到最后一张
       */
      if (this.bannerIndex === 0) {
        this.bannerIndex = this.banners.length - 1;
      } else {
        this.bannerIndex -= 1;
      }

      /**
       * 3秒后继续自动轮播
       */
      this.timeout = setTimeout(() => {
        this.stop = this.autoSwitch();
      }, 3000);
    },

    /**
     * 切换下一张轮播图
     */
    switchNext() {
      /**
       * 先停止自动轮播 防止点击后瞬间切换下一张图片
       */
      this.stop();

      /**
       * 清除上次的定时器
       */
      clearTimeout(this.timeout);
      this.timeout = null;

      /**
       * 切换到下一张图片
       * 切换到最后一张时，回到第一张
       */
      if (this.bannerIndex === this.banners.length - 1) {
        this.bannerIndex = 0;
      } else {
        this.bannerIndex += 1;
      }

      /**
       * 3秒后继续自动轮播
       */
      this.timeout = setTimeout(() => {
        this.stop = this.autoSwitch();
      }, 3000);
    },
  },

  created() {
    /**
     * 将该定时器清除器存储到变量中以便其它生命周期中调用
     */
    this.stop = this.autoSwitch();

    /**
     * 用来存储每次点击时调用的定时器
     */
    this.timeout = null;
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
@import "#/scss/global.scss";

.banner-wrapper {
  background: #ccc;
  transition: background 1.5s;

  .banner {
    position: relative;
    width: 730px;
    margin: 0 auto;
    font-size: 0;

    .iconfont {
      font-size: 50px;
      color: #fff;
    }

    .left-switch-arrow {
      position: absolute;
      left: -68px;
      top: 50%;
      transform: translateY(-50%);

      &:hover,
      &:active {
        background: rgba(51, 51, 51, 0.3);
      }
    }

    .right-switch-arrow {
      position: absolute;
      right: -68px;
      top: 50%;
      transform: translateY(-50%);

      &:hover,
      &:active {
        background: rgba(51, 51, 51, 0.3);
      }
    }

    img {
      display: block;
      width: 730px;
    }

    .dots {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      margin: auto;
      display: flex;

      .dot-wrapper {
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;

        .dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 5px;
          background: #fff;
        }

        .dot-active {
          background: $background-red;
        }
      }
    }
  }
}
</style>
