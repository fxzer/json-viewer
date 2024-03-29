<script lang="ts" setup>
import LayoutOptions from './LayoutOptions.vue'
import { useLayoutStore } from '@/store'

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
})
// 弹窗相关
const emit = defineEmits(['update:value'])
const { type, config } = toRefs(useLayoutStore())
const visible = computed({
  get() {
    return props.value
  },
  set(val) {
    emit('update:value', val)
  },
})
</script>

<template>
  <el-drawer
    v-model="visible"
    title="布局配置"
    :with-header="true"
    :modal="false"
    append-to-body
    modal-class="layout-modal"
    direction="ltr"
    size="450"
    close-on-press-escape
  >
    <LayoutOptions />
    <div class="layout-custom">
      <el-form label-width="80px" :inline="false">
        <!-- 共有方向 -->
        <el-form-item label="布局方向">
          <el-radio-group v-model="config.direction">
            <el-radio-button
              v-for="direction in config.directions"
              :key="direction"
              :label="direction"
            />
          </el-radio-group>
        </el-form-item>
        <!-- indented缩进树  -->
        <div v-if="type === 'indented'" class="indented">
          <el-form-item label="节点换行">
            <el-switch
              v-model="config.dropCap"
              :active-value="true"
              :inactive-value="false"
              inline-prompt
              active-text="是"
              inactive-text="否"
            />
            <span class="text-info">开启后子节点从父节点下一行开始依次渲染</span>
          </el-form-item>
          <el-form-item label="缩进距离">
            <el-input v-model.number="config.indent">
              <template #append>
                px
              </template>
            </el-input>
          </el-form-item>
        </div>
        <!-- dendrogram生态树  -->
        <div v-if="type === 'dendrogram'" class="dendrogram">
          <el-form-item label="层级间距">
            <el-input v-model.number="config.rankSep">
              <template #append>
                px
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="节点间距">
            <el-input v-model.number="config.nodeSep">
              <template #append>
                px
              </template>
            </el-input>
          </el-form-item>
        </div>
        <!--  mindmap脑图树 -->
        <div v-if="type === 'mindmap'" class="mindmap">
          <div class="custom-mode">
            <el-form-item label="水平间距">
              <el-input v-model.number="config.hgap">
                <template #append>
                  px
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="垂直间距">
              <el-input v-model.number="config.vgap">
                <template #append>
                  px
                </template>
              </el-input>
            </el-form-item>
          </div>
        </div>
        <!-- compactBox紧凑树 -->
        <div v-if="type === 'compactBox'" class="compactBox">
          <el-form-item label="水平间距">
            <el-input v-model.number="config.hgap">
              <template #append>
                px
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="垂直间距">
            <el-input v-model.number="config.vgap">
              <template #append>
                px
              </template>
            </el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
.layout-custom {
  .text-info {
    color: #909399;
    font-size: 13px;
    margin-left: 10px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  :deep(.el-radio-group) {
    display: flex;
    width: 100%;
    .el-radio-button {
      flex: 1 !important;
    }
    .el-radio-button__inner {
      width: 100%;
    }
  }
}
</style>
