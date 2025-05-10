import { LANGUAGES } from '@/constants'
import { useMobile } from '@/hooks'
import { useI18n } from 'vue-i18n'

export const useGlobalStore = defineStore('global', () => {
  const i18n = useI18n()
  const language = ref(LANGUAGES.CN)
  const keyword = ref('')
  const focusCount = ref(0)
  const foundCount = ref(0)
  const isDark = useDark()
  const fields = ref(['result'])
  const autoRender = ref(true)
  function toggleLanguage() {
    language.value = i18n.locale.value = language.value === LANGUAGES.CN ? LANGUAGES.EN : LANGUAGES.CN
  }


  function updateFocusIndex() {
    if (foundCount.value > 0) {
      focusCount.value = (focusCount.value + 1) % foundCount.value
    }
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
  return {
    isDark,
    fields,
    keyword,
    language,
    focusCount,
    foundCount,
    autoRender,
    toggleExecuteMode,
    isExpandEditor,
    toggleEditor,
    paneSize,
    toggleLanguage,
    updateFocusIndex,
  }
}, { persist: true })
