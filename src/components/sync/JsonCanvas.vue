<script lang="ts" setup>
import { useCodeStore, useGlobalStore, useGraphStore } from '@/store'

const NodeDialog = defineAsyncComponent(() => import('@/components/async/NodeDialog.vue'))
const { jsonCanvasRef, nodeDetailVisible, nodeDetail } = storeToRefs(useGraphStore())
const { json } = toRefs(useCodeStore())
const { isDark, autoRender, fields } = toRefs(useGlobalStore())
const { render, destroyGraph } = useGraphStore()
watch([json, fields], () => autoRender.value && render(), { deep: true })
watch(isDark, () => render())

// 生命周期钩子
onMounted(() => render())

onUnmounted(() => {
  destroyGraph()
})
</script>

<template>
  <div ref="jsonCanvasRef" class="wh-full" />
  <NodeDialog v-model="nodeDetailVisible" :node-detail="nodeDetail" />
</template>
