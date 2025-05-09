<script lang="ts" setup>
import { useDialogWidth } from '@/hooks'
import { useGraphStore } from '@/store'

const { exportImage } = useGraphStore()
interface ImageConfig {
  name: string
  type: string
}
const width = useDialogWidth(400)
const visible = defineModel<boolean>()
const imageTypes = reactive({
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  WEBP: 'image/webp',
  BMP: 'image/bmp',
})
const exportConfig = ref<ImageConfig> ({
  name: 'json-viewer',
  type: 'image/png',
})

function confirm() {

  const { name, type } = exportConfig.value
  exportImage(name, type)
  visible.value = false

}
</script>

<template>
  <el-dialog v-model="visible" :title="$t('saveImage')" :width="width">
    <el-form label-width="72px">
      <el-form-item :label="$t('imageName')">
        <el-input
          v-model="exportConfig.name"
          :placeholder="$t('saveImagePlaceholder')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('saveFormat')">
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
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="confirm">{{ $t('export') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
