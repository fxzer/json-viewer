import type { LayoutConfig, LayoutState } from '@/types/global'

export const useLayoutStore = defineStore('layout', (): LayoutState => {
  const activeLayout = ref('indented')
  const layoutList = reactive({
    indented: {
      type: 'indented',
      direction: 'H',
      directions: ['LR', 'RL', 'H'],
      indent: 240,
      dropCap: false,
    },
    dendrogram: {
      type: 'dendrogram',
      direction: 'LR',
      directions: ['LR', 'RL', 'H'],
      rankSep: 240,
      nodeSep: 240,
    },
    mindmap: {
      type: 'mindmap',
      direction: 'LR',
      directions: ['LR', 'RL', 'H'],
      // getHGap: 150,//官网写了可以是Number或function,但是改为数字后一直报错Uncaught TypeError: options.getHGap is not a function
      hgap: 100,
      vgap: 100,
      getHGap: () => {
        return 150
      },
      getVGap: () => {
        return 100
      },
    },
    compactBox: {
      type: 'compactBox',
      direction: 'LR',
      directions: ['LR', 'RL', 'H'],
      hgap: 150,
      vgap: 100,
      getHGap: () => {
        return 150
      },
      getVGap: () => {
        return 100
      },
    },
  })
  const activeConfig = computed(() => {
    return layoutList[activeLayout.value]
  })
  return { activeLayout, activeConfig, layoutList }
},{  persist: true})
