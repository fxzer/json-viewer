import { fittingStringFn } from './fittingString'

// 将对象每个键值对格式化为字符串数组
function formatObj(obj: Record<string, any>): string[] {
  return Object.entries(obj).map(([key, value]) => {
    const formattedValue = typeof value === 'string' ? `"${value}"` : value
    return `${key}: ${formattedValue}`
  })
}

// 找到最长的字符串
function getLongestStr(strArr: string[]): string {
  return strArr.reduce((pre, cur) => (pre.length > cur.length ? pre : cur), '')
}

// 获取文本宽度（缓存上下文以减少重复创建）
const getWidth = (() => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const cache = new Map<string, number>()

  return (text: string, font: string = 'normal 12px Arial'): number => {
    const cacheKey = `${font}:${text}`
    if (cache.has(cacheKey))
      return cache.get(cacheKey)!

    context.font = font
    const width = Math.ceil(context.measureText(text).width)
    cache.set(cacheKey, width)
    return width
  }
})()

const fittingString = fittingStringFn()

export function calcNodeSize(cfg: {
  entries: Record<string, any>
  keyName?: string
}): [number, number, string] {
  const { entries, keyName = '' } = cfg
  const hasKeyName = Boolean(keyName)

  const maxWidth = 400
  const lineHeight = 18
  let width = 40
  let height = lineHeight

  if (hasKeyName) {
    const keyNameStr = getWidth(keyName) <= maxWidth ? keyName : fittingString(keyName, maxWidth)
    return [getWidth(keyNameStr), height, keyNameStr]
  }

  const entryKeys = Object.keys(entries)
  const keyNum = entryKeys.length
  height = keyNum * lineHeight

  if (keyNum > 0) {
    const entriesArr = formatObj(entries)
    const longestEntry = getLongestStr(entriesArr)
    const entryWidth = getWidth(longestEntry)
    width = entryWidth <= maxWidth ? entryWidth : maxWidth

    const entriesStr = entriesArr
      .map(item => fittingString(item.replace(/\n|\t/g, ''), maxWidth))
      .join('\n')

    return [width, height, entriesStr]
  }

  return [width, height, '']
}
