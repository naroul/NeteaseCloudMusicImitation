import Vue from 'vue';
import Loading from './loading';

export default class Drop {
  constructor() {}

  /**
   * 给滚动元素绑定回调
   */
  addScrollListener = (el, binding) => {
    /**
     * 离el最近的滚动节点（包括el）
     */
    const scrollNode = this._findScrollNode(el);

    /**
     * 创建 加载节点 “子类”
     */
    const Load = Vue.extend(Loading);

    /**
     * 创建未挂载的 加载节点 实例
     */
    const loadingVm = new Load().$mount();

    /**
     * 是否处于加载状态
     */
    let isLoading = false;

    scrollNode.addEventListener('wheel', async function() {
      /**
       * 如果处于加载状态，则不做处理
       */
      if (isLoading) {
        return;
      }

      /**
       * 判断节点是否为 body，与普通元素不同，body的 scrollTop始终为 0，并且body的clientHeight和scrollHieght一直相同,是普通元素则直接赋值
       */

      const { scrollTop, clientHeight, scrollHeight } =
        scrollNode === document.body ? document.documentElement : scrollNode;

      /**
       * 判断滚动到距离底部10px时，调用下拉加载的回调函数
       */
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        /**
         * 设置状态为 加载中
         */
        isLoading = true;

        /**
         * 挂在 加载节点 表示加载中
         */
        scrollNode.appendChild(loadingVm.$el);

        /**
         * 调用回调
         */
        await binding.value();

        /**
         * 加载结束后 设置状态为 未加载
         */
        isLoading = false;

        /**
         * 加载结束后移除 加载节点 表示加载结束
         */
        scrollNode.removeChild(loadingVm.$el);
      }
    });
  };

  /**
   * 向上遍历找到 overflow为 auto或 scroll的元素（包括自己）
   */
  _findScrollNode = (el) => {
    /**
     * 如果el不存在或el为document时，则返回null
     */
    if (!el || el === document) {
      return null;
    }

    /**
     * el是否为可滚动元素
     */
    const isScroll = ['auto', 'scroll'].includes(
      getComputedStyle(el).overflowY
    );

    return isScroll ? el : this._findScrollNode(el.parentNode);
  };
}
