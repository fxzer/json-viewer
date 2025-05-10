<script lang="ts" setup>
import { useDialogWidth } from '@/hooks'

const props = defineProps({
  nodeDetail: {
    type: Object,
    default: () => ({}),
  },
})
const visible = defineModel<boolean>()
const code = computed(() => {
  const { id, content } = props.nodeDetail
  if (id === 'ROOT')
    return '{}'

  return content
})
const width = useDialogWidth(640)
</script>

<template>
  <el-dialog v-model="visible" :title="$t('nodeDetail')" :width="width">
    <VueCodeMirror :value="code" :style="{ height: '400px', border: '1px solid #9ca3af58' }" />
  </el-dialog>
</template>

<style scoped lang='scss'></style>
