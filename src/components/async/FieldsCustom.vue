<script lang="ts" setup>
import { useGraphStore } from '@/store'

const { fields } = toRefs(useGraphStore())
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
</script>

<template>
  <div class="fields-custom">
    <div class="flex gap-3">
      <el-input
        ref="inputRef" v-model.trim="inputValue" class="flex-1" :placeholder="$t('fieldPlaceholder')"
        @keyup.enter="addField"
      />
      <el-button @click="addField">
        +
      </el-button>
    </div>
    <div class="my-4 flex flex-wrap gap-4">
      <el-tag
        v-for="(field, index) in fields" :key="index" :type="handleType(index)" closable
        :disable-transitions="false" @close="handleClose(index)"
      >
        {{ field }}
      </el-tag>
    </div>
    <p class="rounded bg-gray/10 p3 text-gray">
      <span class="text-amber font-bold">{{ $t('infoName') }}</span>
      {{ $t('info') }}
    </p>
  </div>
</template>
