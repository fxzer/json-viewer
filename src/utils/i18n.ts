import type { App } from 'vue'
import { createI18n } from 'vue-i18n'

import { LANGUAGES } from '@/constants'

import zh from '@/locales/zh-CN'
import en from '@/locales/en-US'

const locale = JSON.parse(localStorage.getItem('global'))?.language || LANGUAGES.CN
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
