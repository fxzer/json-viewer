// 实现自己的文本测量工具
// 计算文本宽度的函数
const measureTextWidth = (() => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  // 缓存计算结果
  const textSizeCache = new Map()

  return (text: string, fontSize: number = 12): number => {
    const key = `${text}-${fontSize}`
    if (textSizeCache.has(key)) {
      return textSizeCache.get(key)
    }

    if (context) {
      context.font = `${fontSize}px Arial`
      const metrics = context.measureText(text)
      const width = metrics.width
      textSizeCache.set(key, width)
      return width
    }

    // 备用方案 - 每个中文字符按fontSize宽度计算，其他字符按fontSize * 0.6计算
    let width = 0
    const pattern = /[\u4E00-\u9FA5]+/
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      if (pattern.test(char)) {
        width += fontSize
      }
      else {
        width += fontSize * 0.6
      }
    }
    textSizeCache.set(key, width)
    return width
  }
})()

// 获取单个字符宽度
function getLetterWidth(letter: string, fontSize: number = 12): number {
  return measureTextWidth(letter, fontSize)
}

export function fittingStringFn(fontSize: number = 12) {
  const ellipsis = '...'
  // 使用新的文本测量方法
  const ellipsisLength = measureTextWidth(ellipsis, fontSize)

  return function (str: string, maxWidth: number) {
    let currentWidth = 0
    let res = str
    const pattern = /[\u4E00-\u9FA5]+/
    str.split('').forEach((letter, i) => {
      if (currentWidth > maxWidth - ellipsisLength)
        return
      if (pattern.test(letter))
        currentWidth += fontSize
      else
        // 使用新的字符宽度测量方法
        currentWidth += getLetterWidth(letter, fontSize)

      if (currentWidth > maxWidth - ellipsisLength)
        res = `${str.substring(0, i)}${ellipsis}`
    })
    return res
  }
}
