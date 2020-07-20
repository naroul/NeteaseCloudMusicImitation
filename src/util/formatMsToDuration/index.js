/**
 * 将毫秒数转换成时长格式 (00:00) 的字符串
 */
export const formatMsToDuration = (ms) => {
  /**
   * 分钟数
   */
  const minutes = parseInt(ms / 1000 / 60);

  /**
   * 秒数
   */
  const seconds = parseInt((ms / 1000) % 60);

  return `${minutes < 10 ? '0' + minutes : minutes}:${
    seconds < 10 ? '0' + seconds : seconds
  }`;
};
