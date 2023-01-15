//防抖函数
export const debounce = (func:Function, deply = 500) => {
  let timer = 0
  return function(...args:any) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func?.apply(this, args)
    }, deply)
  }
}