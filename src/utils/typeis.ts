export function isObject(mybeObj: any) {
  return Object.prototype.toString.call(mybeObj) === '[object Object]'
}

export function isNumber(mybeNumber: any) {
  return typeof mybeNumber === 'number'
}

export function isFunction(mybeFunc: any) {
  return typeof mybeFunc === 'function'
}
