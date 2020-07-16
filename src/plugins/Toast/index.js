import Vue from 'vue';
import ToastBase from './ToastBase';

const Toast = {
  install(Vue, options) {
    Vue.prototype.$toast = {
      normal,
      success,
      failed,
    };
  },
};

const open = ({ type, msg, delay }) => {
  const Toast = Vue.extend(ToastBase);
  const vm = new Toast({
    propsData: {
      type,
      msg,
      delay,
    },
    methods: {
      /**
       * 关闭toast
       */
      close() {
        /**
         * 移除 toast 节点
         */
        document.body.removeChild(this.$el);

        /**
         * 销毁组件实例
         */
        this.$destroy();
      },
    },
  }).$mount();

  document.body.appendChild(vm.$el);
};

/**
 * 显示成功的 toast提示
 */
const normal = (msg, delay) => {
  open({
    delay,
    type: 'normal',
    msg,
  });
};

/**
 * 显示普通的 toast提示
 */
const success = (msg, delay) => {
  open({
    delay,
    type: 'success',
    msg,
  });
};

/**
 * 显示失败的 toast提示
 */
const failed = (msg, delay) => {
  open({
    delay,
    type: 'failed',
    msg,
  });
};

export default Toast;
