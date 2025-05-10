<script setup lang="ts">
import { useMobile } from '@/hooks'
import { useCodeStore, useGlobalStore } from '@/store'
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

const isMobile = useMobile()
const { paneSize } = storeToRefs(useGlobalStore())
const { rawCode } = toRefs(useCodeStore())
</script>

<template>
  <div>
    <Splitpanes
      class="default-theme"
      style="height: 100vh"
      :horizontal="isMobile"
    >
      <Pane max-size="50" :size="paneSize[0]">
        <EditorToolBar />
        <VueCodeMirror v-model="rawCode" :style="{ height: 'calc(100% - 40px);' }" />
      </Pane>
      <Pane :size="paneSize[1]">
        <div h-full>
          <CanvasToolBar />
          <JsonCanvas />
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>

<style lang="scss" scoped>
.splitpanes {
  &.default-theme {
    .splitpanes__pane {
      background-color: transparent;
    }

    :deep(.splitpanes__splitter) {
      background-color: #d1d5db26;
      border-color: #d1d5db26 !important;
    }
  }
}
</style>
