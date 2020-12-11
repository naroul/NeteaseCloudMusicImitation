/**
 * 将毫秒数转换成详细到分钟的字符串描述
 */
export const formatMsToMinStr = (ms) => {
  const timer = new Date(ms);
  const dateStr = `${timer.getFullYear()}年${timer.getMonth() +
    1}月${timer.getDate()}日 ${timer.getHours() + 1}:${timer.getMinutes() + 1}`;

  return dateStr;
};
