<template>
  <!-- 弹窗 -->
  <div class="dlg-wrp">
    <div class="dlg" :style="{ width: `${width}px` }">
      <!-- 标题 -->
      <div class="tl">
        <span>{{ title }}</span>
        <span title="关闭窗体" @click="close" class="cls">x</span>
      </div>

      <!-- 内容 -->
      <div class="cnt">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * 弹窗宽度
     */
    width: {
      type: Number,
      rquired: false,
      default: 400,
    },

    /**
     * 标题
     */
    title: {
      type: String,
      required: false,
      default: "",
    },
  },

  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

.dlg-wrp {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  z-index: 1000;

  .dlg {
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.8);

    .tl {
      position: relative;
      padding-right: 45px;
      padding-left: 18px;
      height: 38px;
      line-height: 38px;
      font-weight: bold;
      font-size: 14px;
      color: #fff;
      background: #2d2d2d;
      border-radius: 3px 3px 0 0;
      border-bottom: 1px solid #191919;
      border-radius: 4px 4px 0 0;
      @include word-hide;

      .cls {
        position: absolute;
        top: 16px;
        right: 20px;
        width: 10px;
        height: 10px;
        overflow: hidden;
        text-indent: -9999px;
        cursor: pointer;
        background: url("~@/assets/images/Common/layer.png");
        background-position: 0 -95px;
      }
    }

    .cnt {
      padding: 20px 40px 30px;
      background: #fff;
    }
  }
}
</style>