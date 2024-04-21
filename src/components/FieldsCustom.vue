<script lang="ts" setup>
const visible = defineModel<boolean>()
import { useFieldsStore } from '@/store'

const { isStorage, fields } = toRefs(useFieldsStore())
function handleType(index: number) {
  return ['success', 'info', 'warning'][index % 3] as any
}
// 标签
const inputValue = ref('')
const inputVisible = ref(false)

const inputRef = ref()
function handleClose(index: number) {
  fields.value.splice(index, 1)
}

function showInput() {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value!.input!.focus()
  })
}

function addField() {
  if (inputValue.value)
    fields.value.push(inputValue.value)

  inputVisible.value = false
  inputValue.value = ''
}
// 是否本地保存
</script>

<template>
  <el-dialog v-model="visible" title="指定额外解析字段" width="400">
    <el-form label-width="72px">
      <el-form-item label="本地保存">
        <el-switch v-model="isStorage" inline-prompt active-text="是" inactive-text="否" />
      </el-form-item>
      <el-form-item label="字段名称">
        <div class="flex gap-4 flex-wrap">
          <el-tag v-for="(field, index) in fields" :key="index" :type="handleType(index)" closable
            :disable-transitions="false" @close="handleClose(index)">
            {{ field }}
          </el-tag>
          <el-input v-if="inputVisible" ref="inputRef" class='w-30' v-model="inputValue" placeholder="回车确认" size="small"
            @keyup.enter="addField" @blur="addField" />
          <el-button v-else size="small" @click="showInput">
            + 添加
          </el-button>
        </div>
      </el-form-item>
    </el-form>

    <p class="bg-gray/10 text-gray rounded p3 text-xs">
      <span class="text-amber">额外解析字段：</span>
      指定后，遇到此字段会将对应的值时，会将其解析为JSON并继续递归处理，并转化为子树。
    </p>
  </el-dialog>
</template>
