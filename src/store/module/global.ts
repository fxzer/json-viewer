import { useI18n } from 'vue-i18n'
import { setHtmlProperty } from '@/utils'
import chroma from "chroma-js";
import { useMobile} from '@/hooks'
export const useGlobalStore = defineStore('global', () => {
  const i18n = useI18n()
  const language = ref('zh-CN')
  const keyword = ref('')
  const focusCount = ref(0)
  const isDark = useDark()
  const fields = ref(['result'])
  const autoRender = ref(true)

  function toggleLanguage() {
    language.value =  i18n.locale.value = language.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  }

  const toggleExecuteMode = useToggle(autoRender)
  const  isMobile  = useMobile()
  const [isExpandEditor, toggleEditor] = useToggle(true)
  const paneSize = computed(() => {
    if(isMobile.value){
      return isExpandEditor.value ? [50,50] : [0, 100]
    }else{
      return isExpandEditor.value ? [30, 70] : [0, 100]
    }
  })
  const colors = {
    "orange": "#fb923c",
    "amber": "#fbbf24",
    "yellow": "#facc15",
    "lime": "#a3e635",
    "green": "#00DC82",
    "teal": "#2dd4bf",
    "cyan": "#22d3ee",
    "sky": "#38bdf8",
    "blue": "#60a5fa",
    "indigo": "#818cf8",
    "violet": "#a78bfa",
    "purple": "#c084fc",
    "fuchsia": "#e879f9",
    "pink": "#f472b6",
    "rose": "#fb7185"
  }
  const colorName = ref('orange')
  const colorValue = computed(() => {
    const color = colors[colorName.value]
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
    colors,
    colorName,
    colorValue,
    autoRender,
    toggleExecuteMode,
    isExpandEditor,
    toggleEditor,
    paneSize,
    toggleLanguage
  }
}, { persist: true })
