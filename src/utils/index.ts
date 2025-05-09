export * from './get-width'
export * from './jsonToTree'
export * from './nodes'
export * from './saveImage'
export * from './typeis'

export function setHtmlProperty(key: string, value: string) {
  document.documentElement.style.setProperty(key, value)
}
