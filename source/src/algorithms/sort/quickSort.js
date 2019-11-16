// 快速排序
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr // 递归出口
  }

  let left = []
  let right = []
  let current = arr.splice(0, 1)
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < current) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }

  return quickSort(left).concat(current, quickSort(right)) // 递归
}

module.exports = quickSort