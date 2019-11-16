const shellSort = require('../shellSort')
const random = require('../../../utils/random')

let arr = []
while (arr.length < 10000) {
  let value = random(1, 20000)
  if (arr.indexOf(value) === -1) {
    arr.push(value)
  }
}
console.log(shellSort(arr))