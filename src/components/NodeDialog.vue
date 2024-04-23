<script lang="ts" setup>
import { useDialogWidth } from '@/hooks'
const visible = defineModel<boolean>()
const props = defineProps({
  nodeDetail: {
    type: Object,
    default: () => ({}),
  },
})
const code = computed(() => {
  let { keyName, entries, id } = props.nodeDetail
  let node = id === 'root' ? {} : keyName || entries
  return JSON.stringify(node, null, 2)
})
const width = useDialogWidth(640)
</script>

<template>
  <el-dialog v-model="visible" :title="$t('nodeDetail')" :width="width">
    <VueCodeMirror :value="code" :style="{ height: '400px', border: '1px solid #9ca3af58' }" />
  </el-dialog>
</template>

<style scoped lang='scss'></style>
