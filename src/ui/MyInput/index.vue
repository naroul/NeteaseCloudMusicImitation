<template>
  <input
    :class="{ disabled }"
    @input="handleInput"
    v-bind="{
      ...{
        value,
        type,
        disabled,
        placeholder,
        readonly,
      },
    }"
    v-on="{
      ...{
        change: onchange,
        click: onclick,
        keydown: onkeydown,
        focus: onfocus,
        blur: onblur,
        paste: onpaste,
      },
    }"
  />
</template>

<script>
import { noop } from 'lodash';

export default {
  props: {
    /**
     * 内容值
     */
    value: {
      type: [String, Number],
      required: false,
      default: '',
    },

    /**
     * 输入框类型
     */
    type: {
      validator(value) {
        return [
          'text',
          'password',
          'email',
          'number',
          'search',
          'tel',
          'url',
          'time',
          'month',
        ].includes(value);
      },
      required: true,
      default: 'text',
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
     * 占位符
     */
    placeholder: {
      type: String,
      required: false,
    },

    /**
     * 只读属性
     */
    readonly: {
      type: Boolean,
      required: false,
    },

    /**
     * change事件回调
     */
    onchange: {
      type: Function,
      required: false,
      default: noop,
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
     * keydown事件回调
     */
    onkeydown: {
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

    /**
     * paste事件回调
     */
    onpaste: {
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
      this.$emit('input', e.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '#/scss/global.scss';

input {
  box-sizing: border-box;
  width: 200px;
  height: 30px;
  padding: 0;
  padding-left: 10px;
  border-radius: 3px;
  border: 1px solid #505050;
  font-size: 15px;
}

.disabled {
  background: $disabled-color !important;
}

@include input-placeholder;
</style>
