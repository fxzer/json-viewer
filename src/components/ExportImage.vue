<script lang="ts" setup>
import type { ImageConfig } from '@/types/export/image'

const visible = defineModel<boolean>()
const emit = defineEmits({
  'confirm': (val: ImageConfig) => true,
})
const imageTypes = reactive({
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  WEBP: 'image/webp',
  BMP: 'image/bmp',
})
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.4)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const exportConfig = ref<ImageConfig> ({
  name: 'json-viewer',
  type: 'image/png',
  padding: 20,
  backgroundColor: '#fff',
})

function confirm() {
  emit('confirm', exportConfig.value)
  visible.value = false
}
</script>

<template>
  <el-dialog v-model="visible" title="将画布导出为图片" width="378">
    <el-form label-width="72px">
      <el-form-item label="图片名称">
        <el-input
          v-model="exportConfig.name"
          placeholder="请输入导出图片名"
          clearable
        />
      </el-form-item>
      <el-form-item label="导出格式">
        <el-radio-group v-model="exportConfig.type">
          <el-radio-button
            v-for="(typeItem, key) of imageTypes"
            :key="typeItem"
            :value="typeItem"
          >
            {{ key }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图片背景">
        <el-color-picker
          v-model="exportConfig.backgroundColor"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirm">导出</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
