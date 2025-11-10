import { Graph, GraphEvent, NodeEvent, treeToGraphData } from '@antv/g6'
import { compressToEncodedURIComponent as encode } from 'lz-string'
import { LAYOUTS } from '@/constants'
import { formatLayoutConfig, jsonToTree, saveImage } from '@/utils'
import { queryKey, useCodeStore } from './code'
import { useGlobalStore } from './global'

const baseUrl = import.meta.env.VITE_BASE_URL as string
const url = new URL(baseUrl, window.location.origin)

export const useGraphStore = defineStore('graph', () => {
  const { parsedJson, rawCode } = toRefs(useCodeStore())
  const { isDark } = toRefs(useGlobalStore())
  const [isExpandNode, toggleNode] = useToggle(true)
  const focusCount = ref(0)
  const keyword = ref('')
  const fields = ref(['result'])
  const jsonCanvasRef = ref<HTMLElement | null>(null)
  const { width, height } = useElementSize(jsonCanvasRef)
  const ratio = ref(1)
  const ratioText = computed(() => `${(ratio.value * 100).toFixed(2)}%`)
  const isFirstLoad = ref(true)
  const [autoRender, toggleExecuteMode] = useToggle(true)
  const activeLayout = ref('mindmap')
  const layoutList = reactive(LAYOUTS)
  const activeConfig = computed(() => layoutList[activeLayout.value])
  // 节点详情状态
  const nodeDetailVisible = ref(false)
  const nodeDetail = ref({})

  // 图实例
  let graph: Graph | null = null

  const render = useDebounceFn(_render, 300)
  /**
   * 渲染JSON数据到图形 (内部实现)
   */
  function _render() {
    if (!parsedJson.value || !jsonCanvasRef.value || !jsonCanvasRef.value.offsetParent) {
      return
    }

    try {
      // 确保图实例已初始化
      if (!graph) {
        graph = initGraph(jsonCanvasRef.value)
        if (!graph)
          return
      }

      // 数据处理与渲染
      graph.clear()
      const tree = jsonToTree(parsedJson.value, fields.value)
      const treeData = treeToGraphData(tree)
      graph.setData(treeData)

      // 使用async/await等待渲染完成
      graph.render().then(() => {
        // 渲染完成后，如果有关键词，执行搜索
        if (keyword.value) {
          if (graph) {
            focusNode(keyword.value)
          }
        }
      }).catch((error) => {
        console.error('图形渲染失败:', error)
      })
    }
    catch (error) {
      console.error('渲染图失败:', error)
    }
  }

  /**
   * 初始化图实例
   */
  function initGraph(container: HTMLElement) {
    if (graph)
      return graph

    if (!container || !container.offsetParent) {
      console.error('容器元素无效或未挂载到DOM')
      return null
    }

    try {
      const layout = formatLayoutConfig(activeConfig.value)

      graph = new Graph({
        container,
        autoFit: 'view',
        theme: isDark.value ? 'dark' : 'light',
        padding: [30, 30, 30, 30],
        zoomRange: [0.1, 3],
        animation: {
          duration: 300, // 动画持续时间（毫秒）
          easing: 'ease-in-out', // 先慢后快的动画曲线
        },
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
          state: {
            focused: {
              haloStroke: '#4ac666',
              halo: true,
              stroke: '#4ac666',
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

      bindEvents()
      return graph
    }
    catch (error) {
      console.error('初始化图实例出错:', error)
      return null
    }
  }

  /**
   * 绑定图事件
   */
  function bindEvents() {
    if (!graph)
      return

    // 监听画布缩放事件
    graph.on(GraphEvent.AFTER_TRANSFORM, () => {
      if (!graph)
        return
      updateRatio()
    })

    // 节点点击事件
    graph.on(NodeEvent.CLICK, (e: any) => {
      if (!graph)
        return

      const { targetType, target } = e
      if (targetType === 'node') {
        nodeDetail.value = graph.getNodeData(target.id)
        nodeDetailVisible.value = true
      }
    })
  }

  /**
   * 更新缩放比例
   */
  function updateRatio() {
    if (!graph) {
      ratio.value = 1
      return
    }

    try {
      ratio.value = graph.getZoom() || 1
    }
    catch {
      // 出现异常时设置默认值
      ratio.value = 1
    }
  }

  /**
   * 按比例缩放
   */
  function zoomBy(value: number) {
    if (!graph)
      return
    graph.zoomBy(value)
    updateRatio()
  }

  /**
   * 适配视图
   */
  function fitView() {
    if (!graph)
      return

    graph.fitView(
      {
        when: 'always',
        direction: 'both',
      },
      {
        duration: 1000,
      },
    )
    updateRatio()
  }

  /**
   * 搜索并聚焦包含关键词的节点
   */
  function focusNode(newKeyword?: string): void {
    console.warn('执行focusNode', { newKeyword, hasGraph: !!graph })

    if (!graph) {
      console.warn('图形未初始化，无法执行搜索')
      return
    }

    // 确保图形已经渲染完成
    // 注意：不要依赖graph.rendered属性，它可能不可靠

    // 切换节点状态的工具函数
    function toggleNodesState(nodes: any[], state: Array<string> = []) {
      if (!nodes || !nodes.length)
        return

      try {
        const stateMap = nodes.reduce((acc, node) => {
          acc[node.id] = state
          return acc
        }, {})
        graph.setElementState(stateMap, true)
      }
      catch (error) {
        console.warn('设置节点状态失败:', error)
      }
    }

    // 清除已有的聚焦状态
    const clearFocusedNodes = () => {
      try {
        const focusedNodes = graph.getElementDataByState('node', 'focused')
        if (focusedNodes && focusedNodes.length)
          toggleNodesState(focusedNodes, [])
      }
      catch (error) {
        console.warn('清除节点聚焦状态失败:', error)
      }
    }

    clearFocusedNodes()

    // 没有关键词时直接重置计数并返回
    if (!newKeyword) {
      focusCount.value = 0
      fitView()
      return
    }

    try {
      // 获取节点数据
      let nodes = []
      try {
        nodes = graph.getNodeData() || []
      }
      catch (error) {
        console.warn('获取节点数据失败:', error)
        nodes = []
      }

      // 如果没有节点数据，可能图形还未完全渲染
      if (!nodes.length) {
        console.warn('图形没有节点数据，可能渲染未完成')
        focusCount.value = 0

        // 尝试延迟再次执行
        setTimeout(() => {
          console.warn('延迟重试搜索')
          focusNode(newKeyword)
        }, 500)
        return
      }

      const lowerKeyword = newKeyword.toLowerCase()

      // 查找包含关键字的节点
      const foundNodes = nodes.filter((node) => {
        if (!node || !node.data)
          return false
        return String(node.content).toLowerCase().includes(lowerKeyword)
      })

      // 更新匹配计数
      focusCount.value = foundNodes.length
      console.warn('找到匹配节点数量:', foundNodes.length)

      const foundCount = foundNodes.length

      if (foundCount > 0) {
        toggleNodesState(foundNodes, ['focused'])

        // 聚焦到节点
        if (foundCount === 1) {
          // 单个节点时，直接聚焦到该节点
          try {
            graph.focusElement(foundNodes[0].id, {
              duration: 300,
              easing: 'ease-in-out',
            })
          }
          catch (error) {
            console.warn('聚焦到节点失败:', error)
            fitView()
          }
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
      focusCount.value = 0
    }
  }

  /**
   * 导出图像
   */
  function exportImage(name: string, type: string) {
    if (!graph)
      return
    saveImage(graph, name, type)
  }

  /**
   * 销毁图实例
   */
  function destroyGraph() {
    try {
      if (graph) {
        graph.off()
        graph.destroy()
        graph = null
      }
    }
    catch (error) {
      console.warn('销毁图实例出错:', error)
      graph = null
    }
  }

  watch(parsedJson, (json) => {
    if (autoRender.value) {
      render()
    }
    isFirstLoad.value = false

    if (Object.keys(json).length === 0) {
      url.searchParams.delete(queryKey)
      window.history.replaceState('', '', `${url.pathname}`)
    }
    else if (!isFirstLoad.value) {
      url.searchParams.set(queryKey, encode(rawCode.value))
      window.history.replaceState('', '', `${url.pathname}${url.search}`)
    }
  })

  watchDebounced(autoRender, () => render(), { debounce: 300 })

  // 监听主题变化
  watch(isDark, () => render())

  // 监听字段变化
  watch(fields, () => autoRender.value && render(), { deep: true })

  // 监听搜索关键词变化
  watchDebounced(() => keyword.value, (newKeyword) => {
    // 确保图形已经渲染完成
    if (graph && graph.rendered) {
      focusNode(newKeyword)
    }
  }, { debounce: 300 })

  // 监听布局配置变化
  watchDebounced(() => activeConfig.value, () => {
    if (graph) {
      const formattedLayout = formatLayoutConfig(activeConfig.value)
      graph.layout(formattedLayout)

      // 重新布局后居中展示
      graph.fitView({
        when: 'always',
        direction: 'both',
      })
    }
  }, { debounce: 400, deep: true })

  // 监听暗色模式变化
  watch(isDark, () => {
    if (graph) {
      graph.setTheme(isDark.value ? 'dark' : 'light')
    }
  })

  // 监听节点展开/收起状态
  watch(isExpandNode, (val) => {
    if (!graph)
      return

    val
      ? graph.expandElement('ROOT', {
          align: true,
          animation: {
            duration: 300, // 300毫秒
            easing: 'ease-in-out', // 先慢后快
          },
        })
      : graph.collapseElement('ROOT', {
          align: true,
          animation: {
            duration: 300, // 300毫秒
            easing: 'ease-in-out', // 先慢后快
          },
        })
  })

  // 监听容器大小变化
  watchDebounced([width, height], ([w, h]) => {
    if (graph) {
      graph.setSize(w, h)
    }
  }, { debounce: 300 })

  return {
    // 状态
    ratio,
    ratioText,
    isExpandNode,
    nodeDetailVisible,
    nodeDetail,
    activeLayout,
    activeConfig,
    keyword,
    fields,
    focusCount,
    autoRender,
    jsonCanvasRef,

    // 方法
    initGraph,
    destroyGraph,
    render,
    zoomBy,
    fitView,
    exportImage,
    toggleNode,
    toggleExecuteMode,
  }
}, { persist: true })
