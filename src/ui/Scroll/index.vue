<template>
  <div
    ref="scroll"
    class="scr-wp"
    :style="{ width: `${scrWrpWidth}px`, height: `${scrWrpHeight}px`, background, ...position, top: `${scrollTop}px` }"
  >
    <div
      class="scr"
      v-if="isShowScr"
      :style="{ width: `${scrWidth}px`, height: `${scrHeight}px`, background: color, borderRadius: `${radius}px`, top: `${scrTop}px` }"
    ></div>
  </div>
</template>

<script>
import { fix } from "^/fix";

export default {
  props: {
    /**
     * 与目标元素绝对定位的定位值
     * 可设置 right bottom left
     * top不可设置
     */
    position: {
      type: Object,
      required: false,
      default: {
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },

    /**
     * 滚动条的尺寸 竖向滚动条的宽度 横向滚动条的高度 单位px
     */
    size: {
      type: Number,
      required: false,
      default: 6,
    },

    /**
     * 滚动条框背景颜色
     */
    background: {
      type: String,
      required: false,
      default: "transparent",
    },

    /**
     * 滚动条颜色
     */
    color: {
      type: String,
      required: false,
      default: "#868686",
    },

    /**
     * 滚动条条边的弧度
     */
    radius: {
      type: Number,
      required: false,
      default: 5,
    },

    /**
     * 父组件改变scrollTop的接口
     */
    scrollTopProps: {
      type: Number,
      rwquired: false,
      default: 0,
    },
  },

  data() {
    return {
      /**
       * 滚动条总（宽度）
       */
      scrWrpWidth: 0,

      /**
       * 滚动条总（长度）
       */
      scrWrpHeight: 0,

      /**
       * 滚动条（宽度）
       */
      scrWidth: 0,

      /**
       * 滚动条（长度）
       */
      scrHeight: 0,

      /**
       * 滚动条距滚动条框顶部的距离
       */
      scrTop: 0,

      /**
       * 对应 outer 的 scrollTop
       */
      scrollTop: 0,
    };
  },

  computed: {
    /**
     * 当内容没有超出父元素时，不显示滚动条
     */
    isShowScr() {
      return !(this.scrHeight >= this.scrWrpHeight);
    },
  },

  watch: {
    /**
     * 设置outer scrollTop 通过 watch位移 outer内容和滚动条
     */
    scrollTop(newTop, oldTop) {
      /**
       * 滚动 outer内容
       * 如果位移量超出最大值或最小值，scrollTop则为该最大/小值
       */
      this.$refs.scroll.parentNode.scrollTop = newTop;

      /**
       * 位移滚动条
       */
      this.scrTop = (newTop / this.cntHeight) * this.scrWrpHeight;
    },

    /**
     * 父组件想改变 scrollTop 时，改变scrollTop
     */
    scrollTopProps(newTopProps, oldTopProps) {
      if (newTopProps === this.scrollTop) {
        /**
         * 如果相等则不需要做赋值操作
         */
        return;
      }

      if (newTopProps >= 0) {
        this.scrollTop = newTopProps;
      }
    },
  },

  methods: {
    /**
     * 鼠标滚轮回调
     */
    wheel(e) {
      /**
       * 阻止触发 body 的scroll事件
       */
      e.preventDefault();

      /**
       * 本次滑动在纵坐标上的距离 mode为0时，deltaY以像素为单位 为1时，以行高为单位（此处不考虑为2，即 页 的情况）
       * 为正数时，向下滑动 为负数时 向上滑动
       */
      const deltaY = e.deltaMode === 0 ? e.deltaY : e.deltaY * this.deltaUnit;

      /**
       * 即将赋给outer的scrollTop的值
       */
      const scrollTop = this.$refs.scroll.parentNode.scrollTop + deltaY;

      /**
       * 设置outer scrollTop 通过 watch位移 outer内容和滚动条
       */
      this.scrollTop =
        scrollTop > this.scrollTopMax
          ? this.scrollTopMax
          : scrollTop < 0
          ? 0
          : scrollTop;

      /**
       * 向父组件暴露 scr事件，并传出scrollTop
       */
      this.$emit("scr", this.scrollTop);
    },
  },

  created() {
    /**
     * 目标元素（outer）的行高，deltaMode 为 1 时的计算单位
     */
    this.deltaUnit = 0;

    /**
     * 目标元素（outer）的内容总高
     */
    this.cntHeight = 0;

    /**
     * outer的 scrollTop的最大值
     */
    this.scrollTopMax = 0;
  },

  mounted() {
    /**
     * 父元素，即目标元素（outer）
     */
    const parentNode = this.$refs.scroll.parentNode;

    /**
     * 设置目标元素（outer）的行高，deltaMode 为 1 时的计算单位
     */
    this.deltaUnit = getComputedStyle(parentNode).lineHeight;

    /**
     * 设置目标元素（outer）的内容总高
     */
    this.cntHeight = parentNode.scrollHeight;

    /**
     * 设置滚动条总宽高 滚动条总宽高
     */
    this.scrWrpWidth = this.size;
    this.scrWrpHeight = parentNode.clientHeight;

    /**
     * outer的 scrollTop的最大值
     */
    this.scrollTopMax = parentNode.scrollHeight - parentNode.offsetHeight;

    /**
     * 纵向滚动条
     */
    this.scrWidth = this.size;
    this.scrHeight =
      parentNode.clientHeight *
      fix(parentNode.clientHeight / parentNode.scrollHeight, 2);

    /**
     * 渲染时跳转到对应位置
     */
    this.scrollTop = this.scrollTopProps;

    /**
     * 给目标元素（outer）绑定鼠标滚轮回调事件
     */
    this.$refs.scroll.parentNode.addEventListener("wheel", this.wheel);
  },
};
</script>

<style lang="scss" scoped>
.scr-wp {
  position: absolute;
  z-index: 2;
  opacity: 0.5;

  .scr {
    position: absolute;
    left: 0;
    box-sizing: border-box;
    cursor: pointer;
    outline: none;
    border: 1px solid #c6c6c6;
    opacity: 0.8;
  }
}
</style>