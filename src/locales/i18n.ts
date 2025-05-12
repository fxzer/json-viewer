import type { App } from 'vue'

import en from '@/locales/en-US'

import zh from '@/locales/zh-CN'
import { createI18n } from 'vue-i18n'

const locale = JSON.parse(localStorage.getItem('global'))?.language || 'zh-CN'
const i18n = createI18n({
  allowComposition: true,
  legacy: false,
  locale,
  messages: {
    zh,
    en,
  },
})

export function setupI18n(app: App) {
  app.use(i18n)
}
