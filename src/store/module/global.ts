import { useMobile } from '@/hooks'
import { useI18n } from 'vue-i18n'

const LANGUAGES = {
  EN: 'en-US',
  CN: 'zh-CN',
}

export const useGlobalStore = defineStore('global', () => {
  const i18n = useI18n()
  const language = ref(LANGUAGES.CN)
  const isDark = useDark()
  function toggleLanguage() {
    language.value = i18n.locale.value = language.value === LANGUAGES.CN ? LANGUAGES.EN : LANGUAGES.CN
  }

  const isMobile = useMobile()
  const [isExpandEditor, toggleEditor] = useToggle(true)
  const paneSize = computed(() => {
    if (isMobile.value)
      return isExpandEditor.value ? [50, 50] : [0, 100]

    else
      return isExpandEditor.value ? [30, 70] : [0, 100]
  })
  return {
    isDark,
    language,
    isExpandEditor,
    toggleEditor,
    paneSize,
    toggleLanguage,
  }
}, { persist: true })
