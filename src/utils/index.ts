export * from './calcNodeSize'
export * from './dealDataToTree'
export * from './fittingString'
export * from './nodes'
export * from './typeis'

export function setHtmlProperty(key: string, value: string) {
  document.documentElement.style.setProperty(key, value)
}
