/**
 * 将毫秒数转换成日期描述的字符串
 */
export const formatMsToDate = (ms) => {
  const timer = new Date(ms);
  const dateStr = `${timer.getFullYear()}年${timer.getMonth() +
    1}月${timer.getDate()}日`;

  return dateStr;
};
