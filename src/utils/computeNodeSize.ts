// 计算节点大小
import { fittingString } from './fittingString'

// 将对象每个键值对 格式化为 字符串数组
function formatObj(obj: any) {
  return Object.entries(obj).map((entriy) => {
    const key = entriy[0]
    const value = entriy[1]
    if (typeof value === 'string')
      return `${key}: "${value}"`
    // boolean/number不加引号
    return `${key}: ${value}`
  })
}

// 找到最长的字符串
function getLongestStr(strArr: string[]) {
  return strArr.reduce((pre, cur) => {
    return pre.length > cur.length ? pre : cur
  })
}

// 获取节点宽度
const getWidth = (() => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  return (text, font = 'normal 12px Arial') => {
    context.font = font
    const metrics = context.measureText(text)
    return Math.ceil(metrics.width)
  }
})()

export function computeNodeSize(cfg: {
  entries: Record<string, any>
  keyName?: string
}): [number, number, string] {
  const { entries, keyName = '' } = cfg
  const hasKeyName = Boolean(keyName)

  let width = 40
  const maxWidth = 400
  const lineHeight = 18
  let height = lineHeight

  if (hasKeyName) {
    const keyNameStr
      = getWidth(keyName) < maxWidth ? keyName : fittingString(keyName, maxWidth)
    return [getWidth(keyNameStr), height, keyNameStr]
  }

  const entryKeys = Object.keys(entries)
  const keyNum = entryKeys.length
  height = keyNum * lineHeight

  if (keyNum) {
    const entriesArr = formatObj(entries)
    const longestEntry = getLongestStr(entriesArr)
    const widthest = getWidth(longestEntry)
    width = widthest < maxWidth ? widthest : maxWidth
    const entriesStr = entriesArr
      .map(item => fittingString(item.replace(/\n|\t/g, ''), maxWidth))
      .join('\n')
    return [width, height, entriesStr]
  }

  return [width, height, '']
}
