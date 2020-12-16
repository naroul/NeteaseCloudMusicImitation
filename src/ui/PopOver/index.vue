<template>
  <div :id="id">
    <!-- popover触发元素容器 -->
    <div class="reference" ref="refer">
      <!-- 具名插槽 触发元素 -->
      <div class="sltwrp" @click="ctrlPop">
        <slot name="reference"></slot>
      </div>

      <!-- 内容容器 -->
      <div
        v-if="isPop"
        @click="ctrlPop"
        class="content"
        :style="{ top: posTop }"
      >
        <slot name="default">
          <!-- 备用内容，未传默认插槽时显示 -->
          <div class="txt-bak">{{ content }}</div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { isChildOfNodeById } from "^/isChildOfNodeById";

export default {
  props: {
    /**
     * 未传入默认插槽时，通过content props来显示内容
     */
    content: {
      type: String,
      required: false,
      default: "popover",
    },
  },

  data() {
    return {
      /**
       * 随机生成唯一的id
       */
      id: "pop-over" + Math.random() * 1e10,

      /**
       * 内容元素对于触发元素的 定位top值
       */
      posTop: 0,

      /**
       * 是否显示内容
       */
      isPop: false,
    };
  },

  watch: {
    isPop(newVal, oldVal) {
      if (newVal) {
        /**
         * 给 body绑定 click，点击 popover之外的元素时，隐藏 pop
         */
        document.body.addEventListener("click", this.close);
      } else {
        /**
         * 关闭时给body解绑
         */
        document.body.removeEventListener("click", this.close);
      }
    },
  },

  methods: {
    /**
     * 触发元素点击回调
     */
    ctrlPop() {
      /**
       * 显示 pop
       */
      this.isPop = !this.isPop;
    },

    /**
     * 关闭pop
     */
    close(e) {
      if (!isChildOfNodeById(this.id, e.target) && !(e.target.id === this.id)) {
        /**
         * 隐藏 pop 并解绑 body 的 click事件
         */
        this.isPop = false;
      }
    },
  },

  mounted() {
    /**
     * 计算触发元素的宽度和高度 用于定位
     */
    const { height } = getComputedStyle(this.$refs.refer);

    this.posTop = height;
  },
};
</script>

<style lang="scss" scoped>
.reference {
  position: relative;
  display: inline-block;

  .sltwrp {
    display: inline-block;
  }

  .content {
    position: absolute;
    right: 0;

    .txt-bak {
      display: flex;
      align-items: center;
      padding: 5px;
      font-size: 12px;
      color: #666;
      background: #fff;
      border: 1px solid #cccfd9;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>