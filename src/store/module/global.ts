import { useI18n } from 'vue-i18n'
import chroma from 'chroma-js'
import { setHtmlProperty } from '@/utils'
import { useMobile } from '@/hooks'
import { LANGUAGES, THEME_COLORS } from '@/constants'

export const useGlobalStore = defineStore('global', () => {
  const i18n = useI18n()
  const language = ref(LANGUAGES.CN)
  const keyword = ref('')
  const focusCount = ref(0)
  const isDark = useDark()
  const fields = ref(['result'])
  const autoRender = ref(true)

  function toggleLanguage() {
    language.value = i18n.locale.value = language.value === LANGUAGES.CN ? LANGUAGES.EN : LANGUAGES.CN
  }

  const toggleExecuteMode = useToggle(autoRender)
  const isMobile = useMobile()
  const [isExpandEditor, toggleEditor] = useToggle(true)
  const paneSize = computed(() => {
    if (isMobile.value)
      return isExpandEditor.value ? [50, 50] : [0, 100]

    else
      return isExpandEditor.value ? [30, 70] : [0, 100]
  })
  const colorName = ref('orange')
  const themeColor = computed(() => {
    const color = THEME_COLORS[colorName.value]
    setHtmlProperty('--el-color-primary', color)
    setHtmlProperty('--el-color-primary-light-9', chroma(color).alpha(0.1).hex())
    setHtmlProperty('--el-color-primary-light-7', chroma(color).alpha(0.3).hex())
    return color
  })
  return {
    isDark,
    fields,
    keyword,
    language,
    focusCount,
    colorName,
    themeColor,
    autoRender,
    toggleExecuteMode,
    isExpandEditor,
    toggleEditor,
    paneSize,
    toggleLanguage,
  }
}, { persist: true })
