/**
 * @param data 需要格式化的数据
 * @param places 保留小数点后几位 默认6位
 */
export const fix = (data, places = 6) => Number(data).toFixed(places);
