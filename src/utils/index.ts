export * from './computeNodeSize'
export * from './dealDataToTree'
export * from './fittingString'
export * from './registerNodes'
export * from './registerBehaviors'
export * from './typeis'
export * from './i18n'

export function setHtmlProperty(key: string, value: string) {
  document.documentElement.style.setProperty(key, value)
}
