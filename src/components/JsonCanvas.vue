<script lang="ts" setup>
import { type LayoutConfig } from '@/types/global'
import registerNodes from '@/utils/registerNodes'
import registerBehaviors from '@/utils/registerBehaviors'
import { dealDataToTree } from '@/utils/dealDataToTree'
import {
  useJsonStore,
  useLayoutStore,
  useSearchStore,
} from '@/store'
import { useThemeStore } from '@/store'
const { colors,colorValue } = toRefs(useThemeStore())
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
const emit = defineEmits(['nodeClick'])
const { formatJson } = toRefs(useJsonStore())
const { activeLayout, activeConfig } = toRefs(useLayoutStore())
const { keyword, focusCount } = toRefs(useSearchStore())
const jsonCanvas = ref<HTMLElement | null>(null)

// 监听formatJson变化
watch(
  () => formatJson.value,
  (newVal) => {
    drawGraph(newVal)
    // 触发聚焦搜索
    setTimeout(() => {
      focusNode(keyword.value)
    }, 500)
  },
  { deep: true },
)
const isDark = useDark()
watch([isDark,colorValue], () => {
  window.location.reload()
})
// 转换配置:两种布局特殊处理 把vgap/hgap转化为箭头函数返回形式
function convertLayoutConfig(config: LayoutConfig) {
  const hvgapLayout = ['mindmap', 'compactBox']
  if (hvgapLayout.includes(config.type)) {
    const gap = {
      getVGap: () => {
        return config.vgap
      },
      getHGap: () => {
        return config.hgap
      },
    }
    config = { ...config, ...gap }
  }
  return config
}
const graph = ref()

// 监听到布局配置变化,重新布局
watch(
  () => activeConfig,
  (val: any) => {
    if (!graph.value)
      return
    const layoutConfig = convertLayoutConfig(val)
    // 重新布局后居中展示
    graph.value.updateLayout(layoutConfig)
    graph.value.fitView(20)
    localStorage.setItem('layoutType', activeLayout.value)
  },
  { deep: true },
)

const nodeDetail = ref({})
function openNodeDetail(node) {
  nodeDetail.value = node.getModel()
  emit('nodeClick', nodeDetail.value)
}


// 初始化
const toolbar = new G6.ToolBar({
  getContent: () => {
    const outDiv = document.createElement('div')
    outDiv.style.display = 'none'
    // 隐藏outDiv
    return outDiv
  },
})
function initGraph() {
  graph.value = new G6.TreeGraph({
    container: jsonCanvas.value as HTMLElement,
    width: width.value,
    height: height.value,
    fitView: true,
    animate: true,
    defaultNode: {
      type: 'flow-rect',
    },
    defaultEdge: {
      type: 'cubic-horizontal',
      style: {
        stroke:  '#9ca3af88' ,
      },
    },
    edgeStateStyles: {
      hover: {
        stroke:  '#9ca3af88' ,
        lineWidth: 2,
      },
    },
    modes: {
      default: [
        { type: 'zoom-canvas', enableOptimize: true },
        { type: 'drag-canvas' },
      ],
    },
    plugins: [toolbar],
    layout: convertLayoutConfig(activeConfig.value),
  })
  registerNodes(colors.value,colorValue.value) // 注册节点
  registerBehaviors(graph.value, openNodeDetail) // 注册行为
}
function drawGraph(data, isUpdate = true) {
  if (!data)
    return
  data = dealDataToTree(data)
  // 判断是否为空对象
  const isEmpty = Object.keys(data).length === 0
  const rootConfig = {
    id: isEmpty ? '{ }' : 'root',
    type: 'root-icon',
  }

  const graphData = Object.assign({}, data, rootConfig)

  // 优化性能
  if (isUpdate)
    graph.value?.changeData(graphData)
  else
    graph.value?.read(graphData)

  if (isEmpty)
    graph.value?.fitView(200)
  else
    graph.value?.zoom(0.85)
}
const { width, height } = useElementSize(jsonCanvas)
watch([width, height], ([w, h]) => {
  if (graph.value)
    graph.value.changeSize(w, h)
})
onMounted(() => {
  initGraph()
  drawGraph(formatJson.value, false)
})

// 展开/收起
watch(
  () => props.isExpand,
  (newVal) => {
    // 获取图数据,修改collapsed属性,重新布局
    const data = graph.value?.save() as any
    data.collapsed = !newVal
    graph.value?.layout()
    if (newVal)
      graph.value?.fitView(20)
    else
      graph.value?.moveTo(width.value / 2, height.value / 2)
  },
)
// 保存为图片
// TODO:大图模糊问题,保存为svg待实现
function saveImage() {
  graph.value?.downloadFullImage('json-viewer')
}

// 清除节点聚焦状态
function clearState(graph) {
  if (!graph)
    return
  const selectedNodes = graph.findAllByState('node', 'focus')
  selectedNodes.forEach((node) => {
    graph.setItemState(node, 'focus', false)
  })
}
// 搜索聚焦节点
function focusNode(keyword: string) {
  clearState(graph.value)
  const kw = keyword.trim()
  if (!kw) {
    focusCount.value = 0
    graph.value?.fitView(20)
  }
  else if ('root'.includes(kw)) {
    const node = graph.value?.findById('root')
    if (node) {
      graph.value?.setItemState(node, 'focus', true) // 切换选中
      focusCount.value = 1
    }
    graph.value?.focusItem('root', true, {
      easing: 'easeCubic',
      duration: 400,
    })
    // 获取所有节点
  }
  else {
    const findHandle = (node) => {
      // 查找规则:entries键值对包含 或 keyName 包含keywork
      let isInclude = false
      const keyName = node.get('model').keyName || ''
      const entries = node.get('model').entries
      if (keyName?.includes(kw)) {
        isInclude = true
        return isInclude
      }
      for (const key in entries) {
        const keyStr = `${key}`
        const valStr = `${entries[key]}`
        if (keyStr?.includes(kw) || valStr?.includes(kw)) {
          isInclude = true
          break
        }
      }
      return isInclude
    }
    const findNodes = graph.value?.findAll('node', findHandle) || []
    focusCount.value = findNodes.length
    // 动画地移动，并配置动画
    if (findNodes.length > 0) {
      graph.value?.focusItem(findNodes[0], true, {
        easing: 'easeCubic',
        duration: 400,
      })
      // 清除所有节点的选中状态
      findNodes.forEach((node) => {
        graph.value?.setItemState(node, 'focus', true) // 切换选中
      })
    }
    else {
      graph.value?.fitView(20)
    }
  }
}
watch(
  () => keyword.value,
  val => focusNode(val),
)
defineExpose({
  saveImage,
  toolbar,
  graph,
})
</script>

<template>
  <div ref="jsonCanvas" class="wh-full" />
</template>

