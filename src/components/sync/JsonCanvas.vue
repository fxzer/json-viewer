<script lang="ts" setup>
import { useCodeStore, useGlobalStore } from '@/store'
import { jsonToTree } from '@/utils'
import { measureTextWidth } from '@/utils/fittingString'
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
const { isDark, keyword, focusCount, autoRender, fields } = toRefs(useGlobalStore())

let graph
const ratio = defineModel<number>('ratio')
const jsonCanvas = ref<HTMLElement | null>(null)
const { width, height } = useElementSize(jsonCanvas)

// 添加日志开关
const debug = ref(false)

// 调试日志函数
function logDebug(...args) {
  if (debug.value) {
    console.warn('[JsonCanvas]', ...args)
  }
}

// 存储事件处理函数引用
const eventHandlers = {
  nodeClick: null,
  afterTransform: null,
  dragStart: null,
  dragEnd: null,
}

let focusTimer = null
async function render() {
  logDebug('执行render()，数据:', json.value)
  if (!graph) {
    logDebug('图实例不存在，初始化')
    await initGraph()
  }

  try {
    await drawGraph(json.value)
    // 不再使用updateStyle，避免错误
    // 触发聚焦搜索
    if (keyword.value) {
      clearTimeout(focusTimer)
      focusTimer = setTimeout(() => {
        focusNode(keyword.value)
      }, 500)
    }
  }
  catch (error) {
    console.error('渲染图失败:', error)
  }
}

watch([json, fields], () => autoRender.value && render(), { deep: true })
watch(isDark, () => autoRender.value && render())

async function initGraph() {
  try {
    logDebug('初始化图实例, container:', jsonCanvas.value)

    // 直接使用标准方式创建图实例
    graph = new Graph({
      container: jsonCanvas.value,
      width: width.value,
      height: height.value,
      autoFit: 'view', //
      padding: [30, 30, 30, 30],
      zoomRange: [0.1, 3],
      animation: false,
      layout: {
        type: 'indented',
        direction: 'LR',
        dropCap: false,
        indent: 300,
        getHeight: () => 60,
        preLayout: false,
      },
      // 使用简单内置节点类型
      node: {
        type: 'flow-rect', // 默认使用矩形节点
        style: {
          // 根据节点标签长度动态计算节点大小
          size: (d) => {
            const { data } = d
            return [data.width, data.height]
          },
          ports: [{ placement: 'left' }, { placement: 'right' }],
          radius: 4,
        },
      },
      edge: {
        type: 'cubic-horizontal',
      },
      // 使用最基本的交互行为，简化配置
      behaviors: [
        'zoom-canvas',
      ],
    })
  }
  catch (error) {
    console.error('初始化图实例出错:', error)
  }
}

async function drawGraph(json: any) {
  if (!json) {
    logDebug('没有数据，跳过绘制')
    return
  }

  if (!graph) {
    logDebug('图实例不存在，初始化后再绘制')
    await initGraph()
  }

  try {
    // 清空现有图数据
    graph.clear()
    // const jsonData = structuredClone(data)
    const tree = jsonToTree(json)

    const treeData = treeToGraphData(tree)
    // 设置图数据
    graph.setData(treeData)

    // 渲染图
    graph.render()
  }
  catch (error) {
    console.error('图形渲染失败:', error)
  }
}

watchDebounced([width, height], ([w, h]) => graph?.setSize(w, h), { debounce: 600 })

onMounted(() => {
  render()

  const keywordWatcher = watch(() => keyword.value, (newKeyword) => {
    if (newKeyword) {
      setTimeout(() => {
        focusNode(newKeyword)
      }, 300)
    }
  })

  // 在组件卸载时清理watcher
  onUnmounted(() => {
    keywordWatcher()
  })
})

// 展开/收起
watch(
  () => props.isExpand,
  (newVal) => {
    // 获取图数据,修改collapsed属性,重新布局
    if (!graph) {
      return
    }

    try {
      // 简化逻辑，避免不必要的操作

      // 直接触发布局
      if (typeof graph.layout === 'function') {
        graph.layout()
      }

      // 视图调整
      setTimeout(() => {
        if (graph) {
          if (newVal) {
            // 展开时，使用autoFit
            graph.autoFit('view')
          }
          else {
            // 收起时，使用translateTo
            const currentWidth = graph.getSize?.()?.[0] || width.value
            const currentHeight = graph.getSize?.()?.[1] || height.value

            if (typeof graph.translateTo === 'function') {
              // 正确的translateTo参数格式 - 数组
              graph.translateTo([currentWidth / 2, currentHeight / 2], {
                duration: 300,
                easing: 'ease',
              })
            }
          }
        }
      }, 300)
    }
    catch (error) {
      console.error('展开/收起节点失败:', error)
    }
  },
)

// 等视图和G6实例准备好后进行缩放
watch(ratio, (val) => {
  if (!graph || val <= 0)
    return

  try {
    // 使用transform方法替代zoomTo
    if (typeof graph.transform === 'function') {
      graph.transform({
        zoom: val,
        type: 'zoom',
      })
    }
  }
  catch (error) {
    console.error('缩放图形失败:', error)
  }
})

// 搜索聚焦节点
function focusNode(newKeyword?: string): void {
  if (!graph || !newKeyword) {
    return
  }

  try {
    // 查找包含关键字的节点
    const nodes = graph.getNodeData()
    if (!nodes || nodes.length === 0) {
      useGlobalStore().setFoundCount(0)
      return
    }

    const foundNodes = nodes.filter((node) => {
      // 检查节点数据中是否包含关键字
      if (!node || !node.data)
        return false

      // 使用label或整个节点数据进行搜索
      const nodeText = (node.data.label || JSON.stringify(node.data)).toLowerCase()
      return nodeText.includes(newKeyword.toLowerCase())
    })

    if (foundNodes.length > 0) {
      const globalStore = useGlobalStore()
      globalStore.setFoundCount(foundNodes.length)

      // 使用常量避免直接访问响应式对象
      const currentFocusIndex = focusCount.value % foundNodes.length
      const focusedNodeId = foundNodes[currentFocusIndex]?.id

      if (focusedNodeId) {
        // 使用focusElement方法将视图中心对准该节点
        graph.focusElement(focusedNodeId, {
          duration: 300,
          padding: 60,
          easing: 'ease',
        })

        // 设置节点状态为选中，确保参数格式正确
        try {
          graph.setElementState(focusedNodeId, 'selected', true)
        }
        catch (e) {
          console.warn('设置节点状态失败:', e)
          // 尝试另一种写法
          try {
            graph.setElementState(focusedNodeId, ['selected'])
          }
          catch (e2) {
            console.warn('另一种方式设置节点状态也失败:', e2)
          }
        }
      }
    }
    else {
      useGlobalStore().setFoundCount(0)
    }
  }
  catch (error) {
    console.error('搜索节点出错:', error)
  }
}

onUnmounted(() => {
  try {
    // 解除事件监听
    if (focusTimer) {
      clearTimeout(focusTimer)
      focusTimer = null
    }

    // 移除事件监听
    if (graph) {
      try {
        // 移除事件监听器
        if (eventHandlers.nodeClick) {
          try {
            graph.off('node:click', eventHandlers.nodeClick)
          }
          catch {
            // 忽略错误
          }
        }

        if (eventHandlers.afterTransform) {
          try {
            graph.off('aftertransform', eventHandlers.afterTransform)
          }
          catch {
            // 忽略错误
          }
        }

        // 安全地销毁图实例 - 添加延迟确保不发生冲突
        setTimeout(() => {
          if (graph) {
            try {
              graph.destroy()
            }
            catch (e) {
              console.warn('销毁图实例时出错:', e)
            }
            graph = null
          }
        }, 100)
      }
      catch (error) {
        console.error('销毁图实例失败:', error)
      }
    }
  }
  catch (error) {
    console.error('组件卸载清理出错：', error)
  }
})
defineExpose({
  render,
  graph,
  toolbar: {
    zoomIn: () => {
      if (!graph)
        return

      try {
        // 使用transform方法替代zoomBy
        if (typeof graph.transform === 'function') {
          const currentZoom = graph.getViewportTransform?.()?.zoom || 1
          graph.transform({
            zoom: currentZoom * 1.1,
            type: 'zoom',
          })
        }
      }
      catch (error) {
        console.error('放大图形失败:', error)
      }
    },
    zoomOut: () => {
      if (!graph)
        return

      try {
        // 使用transform方法替代zoomBy
        if (typeof graph.transform === 'function') {
          const currentZoom = graph.getViewportTransform?.()?.zoom || 1
          graph.transform({
            zoom: currentZoom * 0.9,
            type: 'zoom',
          })
        }
      }
      catch (error) {
        console.error('缩小图形失败:', error)
      }
    },
    autoZoom: () => {
      if (!graph)
        return

      try {
        if (typeof graph.autoFit === 'function') {
          graph.autoFit('view')
        }
      }
      catch (error) {
        console.error('自适应视图失败:', error)
      }
    },
  },
})
</script>

<template>
  <div ref="jsonCanvas" class="wh-full" />
</template>
