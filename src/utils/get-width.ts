export const getWidth = (() => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const cache = new Map<string, number>()

  return (text: string, font: string = 'normal 16px monospace'): number => {
    const cacheKey = `${font}:${text}`
    if (cache.has(cacheKey))
      return cache.get(cacheKey)!

    context.font = font
    const width = Math.ceil(context.measureText(text).width)
    cache.set(cacheKey, width)
    return width
  }
})()
