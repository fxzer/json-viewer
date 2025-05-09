export * from './get-width'
export * from './json-to-tree'
export * from './nodes'
export * from './save-image'
export * from './typeis'

export function setHtmlProperty(key: string, value: string) {
  document.documentElement.style.setProperty(key, value)
}
