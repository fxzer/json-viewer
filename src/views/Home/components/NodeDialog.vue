<template>
  <el-dialog v-model="visible" title="节点详情" width="600">
    <VueJsonEditor
      class="node-detail"
      v-model="node"
      mode="code"
      :show-btns="false"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed, defineProps, defineEmits } from "vue";
const porps = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  nodeDetail: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits({
  "update:value": (val: boolean) => true,
  "update:nodeDetail": (val: any) => true,
});
const close = () => {
  // emit('update:value', false)
  visible.value = false;
};
const visible = computed({
  get() {
    return porps.value;
  },
  set(val: boolean) {
    emit("update:value", val);
  },
});
const node = computed({
  get() {
    let { keyName, entries, id } = porps.nodeDetail;
    if (id === "root") {
      keyName = {};
    }
    return keyName ? keyName : entries;
  },
  set(val: boolean) {
    emit("update:nodeDetail", val);
  },
});
</script>
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
    border-color: #7b6fdd !important;
  }
}
</style>
