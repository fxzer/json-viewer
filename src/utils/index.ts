export * from './format-layout'
export * from './get-width'
export * from './import-export-json'
export * from './json-to-tree'
export * from './register-node'
export * from './save-image'
export function setHtmlProperty(key: string, value: string) {
  document.documentElement.style.setProperty(key, value)
}
