<script setup lang='ts'>
const emit = defineEmits(['update-code'])
const props = defineProps({
  value: {
    type: String,
    required: true
  },
  style: {
    type: Object,
    default: () => ({ height: '100%' })
  }
})
const code = ref<string>()
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
const isDark = useDark()
const extensions = computed(() => isDark.value ? [json(), oneDark] : [json()])

watch(() => props.value, val => code.value = val, { immediate: true })

watch(code, (val) =>  emit('update-code', val))

</script>

<template>
  <codemirror v-model="code" :placeholder="$t('editorPlaceholder')" :style="style" :indent-with-tab="true" :tab-size="2"
    :extensions="extensions"  ></codemirror>
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
