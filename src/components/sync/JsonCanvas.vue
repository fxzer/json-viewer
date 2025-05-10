<script lang="ts" setup>
import { useCodeStore, useGlobalStore, useGraphStore } from '@/store'

const NodeDialog = defineAsyncComponent(() => import('@/components/async/NodeDialog.vue'))
const { jsonCanvasRef, nodeDetailVisible, nodeDetail } = storeToRefs(useGraphStore())
const { isDark } = toRefs(useGlobalStore())
const { render, destroyGraph } = useGraphStore()
watch(isDark, () => render())

// 生命周期钩子
onMounted(() => {
  // 使用 nextTick 确保 DOM 已经完全渲染
  nextTick(() => {
    // 添加一个小延迟，确保元素完全准备好
    setTimeout(() => {
      render()
    }, 100)
  })
})

onUnmounted(() => {
  destroyGraph()
})
</script>

<template>
  <div ref="jsonCanvasRef" class="wh-full" />
  <NodeDialog v-model="nodeDetailVisible" :node-detail="nodeDetail" />
</template>
