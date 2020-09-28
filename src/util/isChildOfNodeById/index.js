/**
 * 根据一直节点的ID 和 节点 查找node 是否为 parentNode的子节点
 * @param { string }  parentNodeId 已知父元素的id
 * @param { ElemntNode } node 需要得知是否在已知父元素下的 节点
 */
export const isChildOfNodeById = (parentNodeId, node) => {
  /**
   * 一直遍历到没有父节点 则表示不在 parentNode中
   */
  if (node.parentNode === null) {
    return false;
  }

  /**
   * 遍历到id相同的父节点，表示 node 在parentNode中
   */
  if (node.parentNode.id === parentNodeId) {
    return true;
  }

  return isChildOfNodeById(parentNodeId, node.parentNode);
};
