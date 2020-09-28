/**
 * 格式化歌词数据
 * @param sourceData 歌词源数据
 */
export const formatLyric = (sourceData) => {
  /**
   * 事件戳的正则 [xx:xx.xxx]
   */
  const timeStampReg = /\[[0-9]{2}:[0-9]{2}\.[0-9]{1,3}\]/g;

  /**
   * 事件戳的数组
   */
  let timeStamps = [];

  /**
   * 歌词数组
   */
  let cnts = [];

  for (let data of sourceData.matchAll(timeStampReg)) {
    timeStamps.push(formatTimeStampToMs(data[0]));
  }

  cnts = sourceData.split(timeStampReg);

  cnts.splice(0, cnts.length - timeStamps.length);

  return {
    timeStamps,
    cnts,
  };
};

/**
 * 将 "[xx:xx.xxx]" 格式转化为ms
 */
function formatTimeStampToMs(timeStamp) {
  const time = timeStamp.split(/\D/);

  let time3 = 0;

  switch (time[3].length) {
    case 1:
      time3 = Number(time[3] * 100);
      break;

    case 2:
      time3 = Number(time[3] * 10);
      break;

    case 3:
      time3 = Number(time[3]);
      break;
  }

  return Number(time[1]) * 60000 + Number(time[2]) * 1000 + time3;
}
