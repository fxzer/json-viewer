import { useI18n } from 'vue-i18n'
import { useMobile } from '@/hooks'

const LANGUAGES = {
  EN: 'en-US',
  CN: 'zh-CN',
}

export const useGlobalStore = defineStore('global', () => {
  const i18n = useI18n()
  const currentLanguage = ref(LANGUAGES.CN)
  const isDark = useDark()
  const isMobile = useMobile()

  function toggleLanguage() {
    const newLanguage = currentLanguage.value === LANGUAGES.CN ? LANGUAGES.EN : LANGUAGES.CN
    currentLanguage.value = i18n.locale.value = newLanguage
  }

  const [isExpandEditor, toggleEditor] = useToggle(true)

  // 根据设备类型和编辑器展开状态动态计算面板尺寸
  const paneSize = computed(() => {
    if (!isExpandEditor.value)
      return [0, 100]

    return isMobile.value ? [50, 50] : [30, 70]
  })
  return {
    isDark,
    currentLanguage,
    isExpandEditor,
    toggleEditor,
    paneSize,
    toggleLanguage,
  }
}, { persist: true })
