<script lang="ts" setup>
import { useGlobalStore } from '@/store'
import { useDialogWidth } from '@/hooks'


const width = useDialogWidth()
const visible = defineModel<boolean>()
const { fields } = toRefs(useGlobalStore())
function handleType(index: number) {
  return ['success', 'info', 'warning'][index % 3] as any
}
const inputValue = ref('')
const inputRef = ref()
function handleClose(index: number) {
  fields.value.splice(index, 1)
}

function addField() {
  if (inputValue.value)
    fields.value.push(inputValue.value)
  inputValue.value = ''
}
// 是否本地保存
</script>

<template>
  <el-dialog v-model="visible" title="指定额外解析字段" :width="width">
    <div class='flex gap-3'>
      <el-input ref="inputRef" class='flex-1' v-model.trim="inputValue" placeholder="输入字段名称，可按回车确认" size="small"
        @keyup.enter="addField" />
      <el-button size="small" @click="addField">
        + 添加
      </el-button>
    </div>
    <div class="flex gap-4 flex-wrap my-4">
      <el-tag v-for="(field, index) in fields" :key="index" :type="handleType(index)" closable
        :disable-transitions="false" @close="handleClose(index)">
        {{ field }}
      </el-tag>
    </div>
    <p class="bg-gray/10 text-gray rounded p3 text-xs">
      <span class="text-amber">额外解析字段：</span>
      指定后，遇到此字段会将对应的值时，会将其解析为JSON并继续递归处理，并转化为子树。
    </p>
  </el-dialog>
</template>
