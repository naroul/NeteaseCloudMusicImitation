import Vue from 'vue';
import Drop from './dropload';

const drop = new Drop();

/**
 * 下拉加载插件 通过指令的形式实现
 */
const DropLoad = {
  install(Vue, options) {
    /**
     * 注册 dropload 指令
     */
    Vue.directive('dropload', {
      inserted: drop.addScrollListener,
      unbind: drop.removeScrollListener,
    });
  },
};

export default DropLoad;
