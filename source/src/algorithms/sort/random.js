/**
 * 随机返回min-max范围内的整数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns
 */
function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}