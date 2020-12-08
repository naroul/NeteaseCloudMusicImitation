<template>
  <div>
    <textarea
      class="ar-t"
      :value="value"
      :placeholder="placeholder"
      @input="handleInput"
      :style="{ width: widthStyle, height: heightStyle }"
    />

    <div class="lb">
      <MyButton class="btn" @clk="confirm"> {{ label }} </MyButton>
      <span :class="['ct', { 'ivd-ct': count < 0 }]">{{ count }}</span>
    </div>
  </div>
</template>

<script>
import MyButton from "@/ui/MyButton";

export default {
  props: {
    /**
     * 已有的文本
     */
    value: {
      type: String,
      required: false,
      default: "",
    },

    /**
     * 文本框的宽度
     */
    width: {
      type: [Number, String],
      required: false,
      default: 448,
    },

    /**
     * 文本框的高度
     */
    height: {
      type: [Number, String],
      required: false,
      default: 120,
    },

    /**
     * 默认说明文本
     */
    placeholder: {
      type: String,
      required: false,
      default: "说点什么",
    },

    /**
     * 是否显示按钮
     */
    isShowBtn: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * 按钮的说明文字
     */
    label: {
      type: String,
      required: false,
      default: "确认",
    },

    /**
     * 输入的最大字数
     */
    maxCount: {
      type: Number,
      required: false,
      default: 140,
    },
  },

  computed: {
    /**
     * 字数
     */
    count() {
      return this.maxCount - this.value.length;
    },

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
     * 传出 input 实现 v-model
     */
    handleInput(e) {
      this.$emit("input", e.target.value);
    },

    /**
     * 确认回调
     */
    confirm() {
      if (this.count >= 0) {
        this.$emit("confirm", this.value);
      }
    },
  },

  components: {
    MyButton,
  },
};
</script>

<style lang="scss" scoped>
@import "#/scss/global.scss";

.ar-t {
  box-sizing: border-box;
  padding: 6px;
  font-size: 12px;
  outline: none;
  resize: none;
  @include input-placeholder;
}

.lb {
  margin-top: 10px;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;

  .ct {
    float: right;
    margin: 0 8px;
    font-size: 12px;
    color: #666;
  }

  .ivd-ct {
    color: #c20c0c;
  }
}

.btn {
  border-radius: 2px;
  width: 46px;
  height: 25px;
  color: #fff;
  text-align: center;
  line-height: 25px;
  font-size: 12px;
  background: url("~@/assets/images/Common/button.png");
  background-position: -84px -64px;

  &:hover {
    color: #fff;
    background-position: -84px -94px;
  }
}
</style>