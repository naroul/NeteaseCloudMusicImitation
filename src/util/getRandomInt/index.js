/**
 * 随机产生[min, max]的整数值
 * @param { number } min 最小值
 * @param { number } max 最大值
 */
export const getRandomInt = (min, max) => {
  return (Math.random() * (max - min + 1) + min) | 0;
};
