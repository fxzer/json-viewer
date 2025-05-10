<script lang="ts" setup>
import { useDialogWidth } from '@/hooks'
import { useGraphStore } from '@/store'
import FieldsCustom from './FieldsCustom.vue'
import LayoutOptions from './LayoutOptions.vue'

const visible = defineModel<boolean>()

const width = useDialogWidth()
// 弹窗相关
const { activeLayout, activeConfig } = toRefs(useGraphStore())
</script>

<template>
  <el-drawer
    v-model="visible"
    :title="$t('config')"
    :with-header="true"
    :modal="false"
    append-to-body
    modal-class="md:w-100"
    direction="ltr"
    :size="width"
    close-on-press-escape
  >
    <el-divider>
      {{ $t('layoutConfig') }}
    </el-divider>
    <LayoutOptions v-model="activeLayout" />
    <div class="layout-custom">
      <el-form label-width="72" :inline="false">
        <!-- 共有方向 -->
        <el-form-item :label="$t('direction')">
          <el-radio-group v-model="activeConfig.direction">
            <el-radio-button
              v-for="direction in activeConfig.directions"
              :key="direction"
              :value="direction"
            >
              {{ direction }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!--  mindmap脑图树 -->
        <div v-if="activeLayout === 'mindmap'" class="mindmap">
          <div class="custom-mode">
            <el-form-item :label="$t('getHGap')">
              <el-input v-model.number="activeConfig.getHGap">
                <template #append>
                  px
                </template>
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('getVGap')">
              <el-input v-model.number="activeConfig.getVGap">
                <template #append>
                  px
                </template>
              </el-input>
            </el-form-item>
          </div>
        </div>
        <!-- compactBox紧凑树 -->
        <div v-if="activeLayout === 'compact-box'" class="compact-box">
          <el-form-item :label="$t('getHGap')">
            <el-input v-model.number="activeConfig.getHGap">
              <template #append>
                px
              </template>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('getVGap')">
            <el-input v-model.number="activeConfig.getVGap">
              <template #append>
                px
              </template>
            </el-input>
          </el-form-item>
        </div>
        <!-- indented缩进树  -->
        <div v-if="activeLayout === 'indented'" class="indented">
          <el-form-item :label="$t('nodeWrap')">
            <div class="flex-y-center flex-nowrap">
              <el-switch
                v-model="activeConfig.dropCap"
                :active-value="true"
                :inactive-value="false"
                inline-prompt
              />
              <span class="ml-3 w-60 truncate text-xs text-gray">{{ $t('nodeWrapInfo') }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('indentDistance')">
            <el-input v-model.number="activeConfig.indent">
              <template #append>
                px
              </template>
            </el-input>
          </el-form-item>
        </div>
        <!-- dendrogram生态树  -->
        <div v-if="activeLayout === 'dendrogram'" class="dendrogram">
          <el-form-item :label="$t('levelSpacing')">
            <el-input v-model.number="activeConfig.rankSep">
              <template #append>
                px
              </template>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('nodeSpacing')">
            <el-input v-model.number="activeConfig.nodeSep">
              <template #append>
                px
              </template>
            </el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <el-divider>
      {{ $t('parseField') }}
    </el-divider>
    <FieldsCustom />
  </el-drawer>
</template>

<style>
.el-drawer__header {
  margin-bottom: 0px !important;
}
</style>

<style scoped lang="scss">
.layout-custom {
  margin-bottom: 40px;
  .el-form-item {
    margin-bottom: 12px;
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
