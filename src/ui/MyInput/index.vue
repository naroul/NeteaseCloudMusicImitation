<template>
  <input
    :class="{ disabled }"
    :style="{ width: widthStyle, height: heightStyle }"
    v-bind="{
      value,
      type,
      disabled,
      placeholder,
      readonly,
    }"
    v-on="{
      input: handleInput,
      change: handleChange,
      keydown: handleKeydown,
      focus: handleFocus,
      blur: handleBlur,
      paste: handlePaste,
    }"
  />
</template>

<script>
import { noop } from "lodash";

export default {
  props: {
    /**
     * 内容值
     */
    value: {
      type: [String, Number],
      required: false,
      default: "",
    },

    /**
     * 输入框类型
     */
    type: {
      validator(value) {
        return [
          "text",
          "password",
          "email",
          "number",
          "search",
          "tel",
          "url",
          "time",
          "month",
        ].includes(value);
      },
      required: true,
      default: "text",
    },

    /**
     * 文本框的宽度
     */
    width: {
      type: [Number, String],
      required: false,
      default: 200,
    },

    /**
     * 文本框的高度
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
      type: [Boolean, String],
      required: false,
    },
  },

  computed: {
    /**
     * 宽度样式
     */
    widthStyle() {
      return typeof this.width === "string" ? this.width : this.width + "px";
    },

    /**
     * 高度样式
     */
    heightStyle() {
      return typeof this.height === "string" ? this.height : this.height + "px";
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
     * change事件回调 抛出 chg 事件
     */
    handleChange(e) {
      this.$emit("chg", e.target.value);
    },

    /**
     * keydown事件回调 抛出 kyd 事件
     */
    handleKeydown(e) {
      this.$emit("kyd", e.target.value);
    },

    /**
     * 聚焦时抛出 fcs 事件
     */
    handleFocus(e) {
      this.$emit("fcs", e.target.value);
    },

    /**
     * 失焦时抛出 blr 事件
     */
    handleBlur(e) {
      this.$emit("blr", e.target.value);
    },

    /**
     * 失焦时抛出 pst 事件
     */
    handlePaste(e) {
      this.$emit("pst", e.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

input {
  box-sizing: border-box;
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
