<template>
  <div
    class="search-box"
    :class="{ disabled }"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <i class="iconfont icon-search" />
    <div class="input-wrapper">
      <input
        @input="handleInput"
        v-bind="{
          value,
          placeholder,
          disabled,
        }"
        v-on="{
          click: handleClick,
          focus: handleFocus,
          blur: handleBlur,
        }"
      />
    </div>
  </div>
</template>

<script>
import { noop } from "lodash";

export default {
  props: {
    /**
     * 宽
     */
    width: {
      type: [Number, String],
      required: false,
      default: 158,
    },

    /**
     * 高
     */
    height: {
      type: [Number, String],
      required: false,
      default: 32,
    },

    /**
     * 内容值
     */
    value: {
      type: [String, Number],
      required: false,
      default: "",
    },

    /**
     * 占位符
     */
    placeholder: {
      type: String,
      required: false,
    },

    /**
     * 禁用状态
     */
    disabled: {
      type: [Boolean, String],
      required: false,
      default: false,
    },

    /**
     * blur事件回调
     */
    onblur: {
      type: Function,
      required: false,
      default: noop,
    },

    /**
     * change事件回调
     */
    onchange: {
      type: Function,
      required: false,
      default: noop,
    },
  },

  methods: {
    /**
     * 输入回调
     */
    handleInput(e) {
      /**
       * 抛出 input事件，实现自定义控件的 v-model
       */
      this.$emit("input", e.target.value);
    },

    /**
     * 点击时抛出 clk 事件
     */
    handleClick(e) {
      this.$emit("click", e);
    },

    /**
     * 聚焦时抛出 fcs 事件
     */
    handleFocus(e) {
      this.$emit("focus", e);
    },

    /**
     * 失焦时抛出 blr 事件
     */
    handleBlur(e) {
      this.$emit("blur", e);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

.search-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid $background-black;
  border-radius: 32px;
  background: #fff;

  .icon-search {
    padding: 3px;
    font-size: 23px;
  }

  .input-wrapper {
    flex-shrink: 1;
    align-self: center;

    input {
      width: 90%;
      border: none;
      text-decoration: none;
      outline: none;
      font-size: 12px;
    }
  }
}

.disabled {
  background: $disabled-color !important;
}
</style>
