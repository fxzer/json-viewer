<script lang="ts" setup>
import { useCodeStore, useGlobalStore, useGraphStore } from '@/store'

const NodeDialog = defineAsyncComponent(() => import('@/components/async/NodeDialog.vue'))
const { jsonCanvasRef, nodeDetailVisible, nodeDetail } = storeToRefs(useGraphStore())
const { json } = toRefs(useCodeStore())
const { isDark, autoRender, fields } = toRefs(useGlobalStore())
const { render } = useGraphStore()
watch([json, fields], () => autoRender.value && render(), { deep: true })
watch(isDark, () => autoRender.value && render())

// 生命周期钩子
onMounted(() => render())
</script>

<template>
  <div ref="jsonCanvasRef" class="wh-full" />
  <NodeDialog v-model="nodeDetailVisible" :node-detail="nodeDetail" />
</template>
