/**
 * 随机产生[min, max]的整数值
 * @param {*最小值} min
 * @param {*最大值} max
 */
export const getRandomInt = (min, max) => {
  return (Math.random() * (max - min + 1) + min) | 0;
};
