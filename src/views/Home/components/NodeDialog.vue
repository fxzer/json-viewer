<script lang="ts" setup>
const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  nodeDetail: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits({
  'update:value': (val: boolean) => true,
  'update:nodeDetail': (val: boolean) => true,
})
const visible = computed({
  get() {
    return props.value
  },
  set(val: boolean) {
    emit('update:value', val)
  },
})
const node = computed({
  get() {
    let { keyName, entries, id } = props.nodeDetail
    if (id === 'root')
      keyName = {}

    return keyName || entries
  },
  set(val: boolean) {
    emit('update:nodeDetail', val)
  },
})
</script>

<template>
  <el-dialog v-model="visible" title="节点详情" width="600">
    <VueJsonEditor
      v-model="node"
      class="node-detail"
      mode="code"
      :show-btns="false"
    />
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.jsoneditor-vue) {
  height: 400px;
  .jsoneditor-menu {
    display: none;
  }
  .jsoneditor-outer {
    height: 435px !important;
  }
  div.jsoneditor {
    border: 1px solid #ccc;
    border-radius: 4px;
  }
}
</style>
