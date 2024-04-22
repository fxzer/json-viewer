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
  <el-dialog v-model="visible" :title="$t('assignField')" :width="width">
    <div class='flex gap-3'>
      <el-input ref="inputRef" class='flex-1' v-model.trim="inputValue" :placeholder="$t('fieldPlaceholder')" size="small"
        @keyup.enter="addField" />
      <el-button size="small" @click="addField">
        +
      </el-button>
    </div>
    <div class="flex gap-4 flex-wrap my-4">
      <el-tag v-for="(field, index) in fields" :key="index" :type="handleType(index)" closable
        :disable-transitions="false" @close="handleClose(index)">
        {{ field }}
      </el-tag>
    </div>
    <p class="bg-gray/10 text-gray rounded p3 text-xs">
      <span class="text-amber">{{ $t('infoName') }}</span>
      {{ $t('info') }}
    </p>
  </el-dialog>
</template>
