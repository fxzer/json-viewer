import { LAYOUTS } from '@/constants'

export const useLayoutStore = defineStore('layout', () => {
  const activeLayout = ref('mindmap')
  const layoutList = reactive(LAYOUTS)
  const activeConfig = computed(() => {
    return layoutList[activeLayout.value]
  })
  return { activeLayout, activeConfig, layoutList }
}, { persist: true })
