// 堆排序
function heapSort(arr) {
  let len = arr.length
  // 初始化，从最后一个父节点开始调整，创建最大堆
  for (let i = Math.floor(len / 2) -1; i >= 0; i--) {
    maxHeap(i, len)
  }
  // 先从第一个元素和已排好元素前一位做交换，再进行调整
  for (let i = len - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]]
    maxHeap(0, i)
  }
  return arr

  // 最大堆函数
  function maxHeap(start, end) {
    // 建立父节点下标和子节点下标
    let dad = start
    let son = dad * 2 + 1
    if (son >= end) {
      return // 若子节点下标超过范围则返回
    }

    if (son + 1 < end && arr[son] < arr[son + 1]) {
      son++
    }
    if (arr[dad] <= arr[son]) {
      [arr[dad], arr[son]] = [arr[son], arr[dad]]
      maxHeap(son, end)
    }
  }
}

module.exports = heapSort