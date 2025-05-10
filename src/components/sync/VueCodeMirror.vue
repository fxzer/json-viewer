<script setup lang='ts'>
import { useCodeStore } from '@/store'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { Codemirror } from 'vue-codemirror'

defineProps({
  style: {
    type: Object,
    default: () => ({ height: '100%' }),
  },
})

const { originCode } = toRefs(useCodeStore())
const isDark = useDark()
const extensions = computed(() => isDark.value ? [json(), oneDark] : [json()])
</script>

<template>
  <Codemirror
    v-model="originCode" :placeholder="$t('editorPlaceholder')"
    :style="{ height: 'calc(100% - 40px);' }" :indent-with-tab="true" :tab-size="2"
    :extensions="extensions"
  />
</template>

<style scoped lang='scss'>
:deep(.ͼ2 .cm-gutters) {
  color: #6b728088;
  background-color: #d1d5db26;
  border-right: 1px solid #d1d5db26 !important;
}

:deep(.ͼ2 .cm-activeLineGutter) {
  background-color: #d1d5db5b;
  color: #9ca3af;
}
</style>
