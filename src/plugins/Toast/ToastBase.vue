<template>
  <div :class="['toast-wrapper', [type]]">
    <div class="toast-chunk">
      <p class="msg">{{ msg }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * 浮窗类型 成功 失败 普通
     */
    type: {
      validator(type) {
        return ['normal', 'success', 'failed'].includes(type);
      },
      required: true,
      default: 'normal',
    },

    /**
     * 要显示的文本内容
     */
    msg: {
      type: String,
      required: true,
      default: '',
    },

    /**
     * Toast自动关闭的延时, 默认2s
     */
    delay: {
      type: Number,
      required: false,
      default: 2000,
    },
  },

  methods: {
    /**
     * 定义关闭组件的方法 在插件 '子类' install方法中重新定义
     */
    close() {},
  },

  mounted() {
    /**
     * 默认两秒后注销组件
     */
    this.timeout = setTimeout(() => this.close(), this.delay);
  },

  beforeDestroy() {
    /**
     * 卸载前清理定时器
     */
    clearTimeout(this.timeout);
  },
};
</script>

<style lang="scss" scoped>
@import '#/scss/global.scss';

.toast-wrapper {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;

  .toast-chunk {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 4px;

    .msg {
      display: inline-block;
      margin: 0;
      max-width: 200px;
      font-size: 14px;
      color: #fff;
      line-height: 20px;
    }
  }
}

.normal {
  background: rgba(0, 0, 0, 0.7);
}

.success {
  background: $success-green;
}

.failed {
  background: $failed-red;
}
</style>
