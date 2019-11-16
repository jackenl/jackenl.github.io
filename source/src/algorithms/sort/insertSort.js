// 插入排序
function insetSort(arr) {
  let len = arr.length
  for (let i = 1; i < len - 1; i++) {
    for (let j = i; j > 0; j--) {
      if (arr[j] < arr[j - 1]) {
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
      }
    }
  }
  return arr
}

module.exports = insetSort