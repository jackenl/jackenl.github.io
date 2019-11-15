function selectSort(arr) {
  let len = arr.length
  let min
  for (let i = 0; i < len - 1; i++) {
    min = i
    for (let j = i; j < len; j++) {
      if (arr[min] > arr[j]) {
        min = j
      }
    }
    if (min !== i) {
      [arr[i], arr[min]] = [arr[min], arr[i]]
    }
  }
  return arr
}

module.exports = selectSort