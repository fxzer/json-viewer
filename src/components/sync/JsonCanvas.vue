<script lang="ts" setup>
import { useCodeStore, useGlobalStore } from '@/store'
import { jsonToTree, saveImage } from '@/utils'
import { Graph, treeToGraphData } from '@antv/g6'

const props = defineProps({
  isExpand: {
    type: Boolean,
    default: false,
  },
  isExpandEditor: {
    type: Boolean,
    default: true,
  },
})

const { json } = toRefs(useCodeStore())
const { isDark, keyword, focusCount, autoRender, fields, isExpandNode } = toRefs(useGlobalStore())
const globalStore = useGlobalStore()

let graph = null
const ratio = defineModel<number>('ratio')
const jsonCanvas = ref<HTMLElement | null>(null)
const { width, height } = useElementSize(jsonCanvas)

// TODO: 收起/展开节点(综合节点深度、子节点数量、节点内容复杂度)
watch(isExpandNode, (val) => {
  if (graph) {
    // 收起并保证展开/收起的节点位置不变
    val
      ? graph.expandElement('ROOT', {
          align: true,
          // animation: true,
        })
      : graph.collapseElement('ROOT', {
          align: true,
          // animation: true,
        })
  }
})
// 调试设置
const debug = ref(false)
const logDebug = (...args) => debug.value && console.warn('[JsonCanvas]', ...args)

// 避免内存泄漏的计时器引用
let focusTimer = null

/**
 * 初始化图实例
 */
function initGraph() {
  if (graph)
    return graph

  logDebug('初始化图实例, container:', jsonCanvas.value)

  try {
    graph = new Graph({
      container: jsonCanvas.value,
      width: width.value,
      height: height.value,
      autoFit: 'view',
      padding: [30, 30, 30, 30],
      zoomRange: [0.1, 3],
      animation: false,
      layout: {
        type: 'mindmap',
        direction: 'LR',
        preLayout: false,
        getHeight: (d) => {
          // 根据内容行数动态调整高度
          return d.data?.height
        },
        getWidth: (d) => {
          return d.data.width
        },
        getVGap: (d) => {
          return d.data?.height
        },
        getHGap: (d) => {
          return d.data?.width * 2
        },
      },
      node: {
        type: 'flow-rect',
        style: {
          size: (d) => {
            const { data } = d
            return [data.width, data.height] as [number, number]
          },
          ports: [{ placement: 'left' }, { placement: 'right' }],
          radius: 4,
        },
      },
      edge: {
        type: 'cubic-horizontal',
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
      graph = initGraph()
      if (!graph)
        return
    }

    // 数据处理与渲染
    graph.clear()
    const tree = jsonToTree(json.value)
    const treeData = treeToGraphData(tree)
    graph.setData(treeData)
    graph.render()

    // 处理搜索关键词
    if (keyword.value) {
      clearTimeout(focusTimer)
      focusTimer = setTimeout(() => focusNode(keyword.value), 300)
    }
  }
  catch (error) {
    console.error('渲染图失败:', error)
  }
}

/**
 * 搜索并聚焦包含关键词的节点
 */
function focusNode(newKeyword?: string): void {
  if (!graph || !newKeyword)
    return

  try {
    const nodes = graph.getNodeData()
    if (!nodes || nodes.length === 0) {
      globalStore.setFoundCount(0)
      return
    }

    // 查找包含关键字的节点
    const foundNodes = nodes.filter((node) => {
      if (!node || !node.data)
        return false
      const nodeText = (node.data.label || JSON.stringify(node.data)).toLowerCase()
      return nodeText.includes(newKeyword.toLowerCase())
    })

    globalStore.setFoundCount(foundNodes.length)

    if (foundNodes.length > 0) {
      const currentFocusIndex = focusCount.value % foundNodes.length
      const focusedNodeId = foundNodes[currentFocusIndex]?.id

      if (focusedNodeId) {
        // 聚焦到节点
        graph.focusElement(focusedNodeId, {
          duration: 300,
          padding: 60,
          easing: 'ease',
        })

        // 尝试设置节点状态
        try {
          graph.setElementState(focusedNodeId, 'selected', true)
        }
        catch (_) {
          console.warn('设置节点状态失败，尝试备用方法')
          try {
            graph.setElementState(focusedNodeId, ['selected'])
          }
          catch (_) {
            // 忽略备用方法失败
          }
        }
      }
    }
  }
  catch (error) {
    console.error('搜索节点出错:', error)
  }
}

/**
 * 工具栏方法
 */
const toolbar = {
  zoomIn: () => {
    if (!graph)
      return

    try {
      const currentZoom = graph.getViewportTransform?.()?.zoom || 1
      graph.transform({
        zoom: currentZoom * 1.1,
        type: 'zoom',
      })
    }
    catch (error) {
      console.error('放大图形失败:', error)
    }
  },

  zoomOut: () => {
    if (!graph)
      return

    try {
      const currentZoom = graph.getViewportTransform?.()?.zoom || 1
      graph.transform({
        zoom: currentZoom * 0.9,
        type: 'zoom',
      })
    }
    catch (error) {
      console.error('缩小图形失败:', error)
    }
  },

  autoZoom: () => {
    if (!graph)
      return

    try {
      graph.autoFit?.('view')
    }
    catch (error) {
      console.error('自适应视图失败:', error)
    }
  },
}

// 监听数据和主题变化触发渲染
watch([json, fields], () => autoRender.value && render(), { deep: true })
watch(isDark, () => autoRender.value && render())

// 监听画布尺寸变化
watchDebounced([width, height], ([w, h]) => graph?.setSize(w, h), { debounce: 300 })

// 监听搜索关键词变化
watch(() => keyword.value, (newKeyword) => {
  if (newKeyword) {
    clearTimeout(focusTimer)
    focusTimer = setTimeout(() => focusNode(newKeyword), 300)
  }
})

// 监听展开/收起状态
watch(() => props.isExpand, (newVal) => {
  if (!graph)
    return

  try {
    // 触发布局更新
    graph.layout?.()

    // 视图调整
    setTimeout(() => {
      if (!graph)
        return

      if (newVal) {
        // 展开时自适应视图
        graph.autoFit?.('view')
      }
      else {
        // 收起时居中
        const [currentWidth, currentHeight] = graph.getSize?.() || [width.value, height.value]
        graph.translateTo?.([currentWidth / 2, currentHeight / 2], {
          duration: 300,
          easing: 'ease',
        })
      }
    }, 300)
  }
  catch (error) {
    console.error('展开/收起节点失败:', error)
  }
})

// 监听缩放比例变化
watch(ratio, (val) => {
  if (!graph || val <= 0)
    return

  try {
    graph.transform?.({
      zoom: val,
      type: 'zoom',
    })
  }
  catch (error) {
    console.error('缩放图形失败:', error)
  }
})

// 生命周期钩子
onMounted(() => {
  render()
})

// 清理资源
onUnmounted(() => {
  // 清理计时器
  if (focusTimer) {
    clearTimeout(focusTimer)
    focusTimer = null
  }

  // 销毁图实例
  if (graph) {
    try {
      graph.destroy()
    }
    catch (e) {
      console.warn('销毁图实例时出错:', e)
    }
    graph = null
  }
})

function zoomIn() {
  if (!graph)
    return

  graph.zoomBy(1.2)
  ratio.value = graph.getZoom()
}

function zoomOut() {
  if (!graph)
    return

  graph.zoomBy(0.8)
  ratio.value = graph.getZoom()
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
  ratio.value = graph.getZoom()
}
function exportImage(name: string, type: string) {
  saveImage(graph, name, type)
}
// 暴露方法和对象
defineExpose({
  render,
  zoomIn,
  zoomOut,
  fitView,
  exportImage,
  // toolbar,
})
</script>

<template>
  <div ref="jsonCanvas" class="wh-full" />
</template>
