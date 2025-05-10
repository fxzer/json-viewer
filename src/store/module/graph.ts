import { LAYOUTS } from '@/constants'
import { COLORS } from '@/constants/theme-colors'
import { jsonToTree, saveImage } from '@/utils'
import { isFunction, isNumber } from '@/utils/typeis'
import { CanvasEvent, EdgeEvent, Graph, GraphEvent, NodeEvent, treeToGraphData } from '@antv/g6'
import chroma from 'chroma-js'
import { useCodeStore } from './code'
import { useGlobalStore } from './global'

export const useGraphStore = defineStore('graph', () => {
  // 调试设置
  const debug = ref(false)
  const logDebug = (...args) => debug.value && console.warn('[JsonCanvas]', ...args)
  const { json } = toRefs(useCodeStore())
  const { isDark } = toRefs(useGlobalStore())
  const [isExpandNode, toggleNode] = useToggle(true)

  const { keyword, focusCount, fields } = storeToRefs(useGlobalStore())
  const jsonCanvasRef = ref<HTMLElement | null>(null)
  const { width, height } = useElementSize(jsonCanvasRef)
  const ratio = ref(1)
  const ratioText = computed(() => {
    return `${(ratio.value * 100).toFixed(2)}%`
  })

  const activeLayout = ref('mindmap')
  const layoutList = reactive(LAYOUTS)
  const activeConfig = computed(() => {
    return layoutList[activeLayout.value]
  })
  // 监听搜索关键词变化
  watchDebounced(() => keyword.value, newKeyword => focusNode(newKeyword), { debounce: 300 })
  // 节点点击
  const nodeDetailVisible = ref(false)
  const nodeDetail = ref({})

  function layoutFormat(layoutConfig: any) {
    const config = { ...layoutConfig }
    if (['mindmap', 'compact-box'].includes(config.type)) {
      const { getVGap, getHGap } = config
      config.getVGap = () => getVGap
      config.getHGap = () => getHGap
    }
    config.animation = false
    return config
  }
  let graph: Graph | null = null

  watchDebounced(() => activeConfig.value, (_newLayout) => {
    if (graph) {
      const formattedLayout = layoutFormat(activeConfig.value)
      graph.layout(formattedLayout)
      // 重新布局后居中展示
      graph.fitView({
        when: 'always',
        direction: 'both',
      })
    }
  }, { debounce: 400, deep: true })
  function initGraph(container: HTMLElement) {
    if (graph)
      return graph

    try {
      const layout = layoutFormat(activeConfig.value)
      graph = new Graph({
        container,
        autoFit: 'view',
        theme: isDark.value ? 'dark' : 'light',
        padding: [30, 30, 30, 30],
        zoomRange: [0.1, 3],
        animation: true,
        layout,
        node: {
          type: 'flow-rect',
          style: {
            cursor: 'pointer',
            size: (d) => {
              const { data } = d
              return [data.width, data.height] as [number, number]
            },
            ports: [{ placement: 'left' }, { placement: 'right' }],
            radius: 4,
            fillOpacity: 0.1,
            lineWidth: 1,
          },
          // 状态样式
          state: {
            focused: {
              haloStroke: COLORS.green,
              halo: true,
              stroke: COLORS.green,
            },
          },
        },
        edge: {
          type: 'cubic-horizontal',
          style: {
            strokeOpacity: 0.5,
          },
        },
        behaviors: ['zoom-canvas', 'drag-canvas'],
      })

      return graph
    }
    catch (error) {
      console.error('初始化图实例出错:', error)
      return null
    }
  }
  /**
   * 渲染JSON数据到图形
   */
  function render() {
    logDebug('执行render()，数据:', json.value)

    if (!json.value) {
      logDebug('没有数据，跳过绘制')
      return
    }

    try {
    // 确保图实例已初始化
      if (!graph) {
        if (!jsonCanvasRef.value)
          return

        graph = initGraph(jsonCanvasRef.value)
        if (!graph)
          return
      }

      // 数据处理与渲染
      graph.clear()
      const tree = jsonToTree(json.value, fields.value)
      const treeData = treeToGraphData(tree)
      graph.setData(treeData)
      graph.render()
      bindEvents()
      // 处理搜索关键词
      if (keyword.value) {
        focusNode(keyword.value)
      }
    }
    catch (error) {
      console.error('渲染图失败:', error)
    }
  }
  function zoomBy(value: number) {
    if (!graph)
      return

    graph.zoomBy(value)
    updateRatio()
  }
  function updateRatio() {
    ratio.value = graph?.getZoom() || 1
  }
  function fitView() {
    graph.fitView(
      {
        when: 'always', // 始终进行适配
        direction: 'both', // 在两个方向上适配
      },
      {
        duration: 1000, // 带动画效果
      },
    )
    updateRatio()
  }

  function bindEvents() {
    // 监听画布缩放事件
    graph.on(GraphEvent.AFTER_TRANSFORM, () => {
      updateRatio()
    })
    /* 节点点击 */
    graph.on(NodeEvent.CLICK, (e: any) => {
      const { targetType, target } = e
      if (targetType === 'node') {
        nodeDetail.value = graph.getNodeData(target.id)
        nodeDetailVisible.value = true
      }
    })
  }

  /**
   * 搜索并聚焦包含关键词的节点
   * @param newKeyword 搜索关键词
   */
  function focusNode(newKeyword?: string): void {
    if (!graph)
      return

    function toggleNodesState(nodes: any[], state: Array<string> = []) {
      if (!nodes.length)
        return

      const stateMap = nodes.reduce((acc, node) => {
        acc[node.id] = state
        return acc
      }, {})
      graph.setElementState(stateMap, true)
    }
    // 清除已有的聚焦状态
    const clearFocusedNodes = () => {
      const focusedNodes = graph.getElementDataByState('node', 'focused')
      toggleNodesState(focusedNodes, [])
    }

    // 清除已存在的聚焦状态
    clearFocusedNodes()

    // 没有关键词时直接重置计数并返回
    if (!newKeyword) {
      focusCount.value = 0
      fitView()
      return
    }

    try {
      const lowerKeyword = newKeyword.toLowerCase()
      const nodes = graph.getNodeData()

      // 查找包含关键字的节点
      const foundNodes = nodes.filter((node) => {
        if (!node || !node.data)
          return false
        return String(node.content).toLowerCase().includes(lowerKeyword)
      })

      // 更新匹配计数
      focusCount.value = foundNodes.length

      const foundCount = foundNodes.length

      if (foundCount > 0) {
        toggleNodesState(foundNodes, ['focused'])

        // 聚焦到节点
        if (foundCount === 1) {
          // 单个节点时，直接聚焦到该节点
          graph.focusElement(foundNodes[0].id, {
            duration: 300,
            easing: 'ease',
          })
        }
        else {
          fitView()
        }
      }
      else {
        fitView()
      }
    }
    catch (error) {
      console.warn('节点聚焦失败:', error)
    }
  }
  watch(isDark, () => {
    if (graph) {
      graph.setTheme(isDark.value ? 'dark' : 'light')
    }
  })

  //  收起/展开节点
  watch(isExpandNode, (val) => {
    if (graph) {
    // 收起并保证展开/收起的节点位置不变
      val
        ? graph.expandElement('ROOT', {
            align: true,
            animation: true,
          })
        : graph.collapseElement('ROOT', {
            align: true,
            animation: true,
          })
    }
  })

  watchDebounced([width, height], ([w, h]) => graph?.setSize(w, h), { debounce: 300 })

  function exportImage(name: string, type: string) {
    saveImage(graph, name, type)
  }
  function destroyGraph() {
    graph?.destroy()
  }

  return { ratio, ratioText, initGraph, destroyGraph, render, zoomBy, fitView, jsonCanvasRef, exportImage, isExpandNode, toggleNode, nodeDetailVisible, nodeDetail, activeLayout, activeConfig }
}, { persist: true })
