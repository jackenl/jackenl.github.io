// 希尔排序
function shellSort(arr) {
  let len = arr.length
  let fraction = Math.floor(len / 2)
  while(fraction > 0) {
    for (let i = fraction; i < len; i++) {
      for (let j = i - fraction; j >= 0; j -= fraction) {
        if (arr[j] > arr[fraction + j]) {
          [arr[j], arr[fraction + j]] = [arr[fraction + j], arr[j]]
        }
      }
    }
    fraction = Math.floor(fraction / 2)
  }
  return arr
}

module.exports = shellSort