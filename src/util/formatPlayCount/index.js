/**
 * 计算播放量并换算单位
 * 小于10万直接返回数字
 * 大于10万用 '万' 作为单位，最后一位四舍五入取整
 * 返回数字或字符串
 */
export const formatPlayCount = (count) =>
  count > 100000 ? `${(count / 10000 + 0.5) | 0}万` : count;
