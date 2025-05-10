<script lang="ts" setup>
import { useGraphStore } from '@/store'

const NodeDialog = defineAsyncComponent(() => import('@/components/async/NodeDialog.vue'))
const { jsonCanvasRef, nodeDetailVisible, nodeDetail } = storeToRefs(useGraphStore())
const { render, destroyGraph } = useGraphStore()

onMounted(render)

onBeforeUnmount(destroyGraph)
</script>

<template>
  <div ref="jsonCanvasRef" class="wh-full" />
  <NodeDialog v-model="nodeDetailVisible" :node-detail="nodeDetail" />
</template>
