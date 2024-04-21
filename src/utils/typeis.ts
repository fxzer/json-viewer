export function isObject(mybeObj: any) {
  return Object.prototype.toString.call(mybeObj) === '[object Object]'
}
