/**
 * 防抖 只执行最后一次回调
 * @param fn 需要防抖的回调函数
 * @param delay 防抖的延时
 */
export const debounce = (fnName, delay) => {
  let timeout = null;

  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      this[fnName].apply(this, arguments);
    }, delay);
  };
};
