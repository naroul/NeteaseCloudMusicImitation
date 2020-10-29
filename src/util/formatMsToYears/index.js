/**
 * 将毫秒数转换成年代描述的字符串 如： "90后"， "00后"
 */
export const formatMsToYears = (ms) => {
  const timer = new Date(ms);

  /**
   * 年
   */
  const yearStr = String(timer.getFullYear());

  /**
   * 年代描述
   */
  const years = `${yearStr.substr(yearStr.length - 2, 1)}0后`;
  return years;
};
