/**
 * 二分查找 按大小查找 sVal 在 soueceArray 中的区间index
 * @param {*} sVal 需要查找的值
 * @param {*} arr 目标数组
 */
export const binarySearch = (sVal, arr) => {
  /**
   * 查找范围最大的index
   */
  let maxIndex = arr.length - 1;

  /**
   * 查找范围最小的index
   */
  let minIndex = 0;

  while (minIndex <= maxIndex) {
    /**
     * 每次循环计算二分点
     */
    let midIndex = Math.floor((minIndex + maxIndex) / 2);

    if (arr[midIndex] <= sVal && sVal < arr[midIndex + 1]) {
      return midIndex;
    } else if (sVal > arr[midIndex]) {
      minIndex = midIndex + 1;
    } else {
      maxIndex = midIndex - 1;
    }
  }

  return 0;
};
