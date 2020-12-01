<template>
  <button
    :class="{ disabled }"
    :style="{ width: `${width}px`, height: `${height}px` }"
    v-bind="{
      disabled,
    }"
    v-on="{
      click: handleClick,
      focus: handleFocus,
      blur: handleBlur,
    }"
  >
    <slot></slot>
  </button>
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
    },

    /**
     * 高
     */
    height: {
      type: [Number, String],
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
  },

  methods: {
    /**
     * 点击时抛出 clk 事件
     */
    handleClick() {
      this.$emit("clk");
    },

    /**
     * 聚焦时抛出 fcs 事件
     */
    handleFocus() {
      this.$emit("fcs");
    },

    /**
     * 失焦时抛出 blr 事件
     */
    handleBlur() {
      this.$emit("blr");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

button {
  padding: 0 8px;
  border: none;
  border-radius: 4px;
  box-shadow: none;
  line-height: normal;
  text-align: center;
  font-size: 15px;
  color: #404040;
  background: $btn-grey-normal;
  outline: none;
  cursor: pointer;

  &:hover {
    border-color: $border-grey-white;
    color: $white-color;
    background-color: $btn-white-hover;
  }

  &:active {
    border-color: $border-grey-white;
    color: $white-color;
    background-color: rgba(228, 230, 237, 0.45);
  }
}

.disabled {
  background: $disabled-color !important;
  color: #bebebe !important;
}
</style>
