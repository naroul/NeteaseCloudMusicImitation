<template>
  <button
    :class="{ disabled }"
    :style="{ width: `${width}px`, height: `${height}px` }"
    v-bind="{
      disabled,
    }"
    v-on="{
      click: onclick,
      focus: onfocus,
      blur: onblur,
    }"
  >
    <slot></slot>
  </button>
</template>

<script>
import { noop } from 'lodash';

export default {
  props: {
    /**
     * 宽
     */
    width: {
      type: [Number, String],
      required: false,
      default: 80,
    },

    /**
     * 高
     */
    height: {
      type: [Number, String],
      required: false,
      default: 30,
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
     * click事件回调
     */
    onclick: {
      type: Function,
      required: false,
      default: noop,
    },

    /**
     * focus事件回调
     */
    onfocus: {
      type: Function,
      required: false,
      default: noop,
    },

    /**
     * blur事件回调
     */
    onblur: {
      type: Function,
      required: false,
      default: noop,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '#/scss/global.scss';

button {
  padding: 0 8px;
  border: none;
  border-radius: 4px;
  box-shadow: none;
  line-height: normal;
  text-align: center;
  font-size: 15px;
  color: #404040;
  background: $white-color;
  outline: none;
  cursor: pointer;

  &:hover {
    border-color: $border-grey-white;
    color: $white-color;
    background-color: rgba(228, 230, 237, 0.25);
  }

  &:active {
    border-color: $border-grey-white;
    color: $white-color;
    background-color: rgba(228, 230, 237, 0.45);
  }
}

.disabled {
  background: $disabled-color !important;
}
</style>
