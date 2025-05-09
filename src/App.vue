<script setup lang="ts">
import { useMobile } from '@/hooks'
import { useCodeStore, useGlobalStore } from '@/store'
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

const { originCode, formatCode } = toRefs(useCodeStore())
const { paneSize } = storeToRefs(
  useGlobalStore(),
)

function onUpdateCode(codeStr: string) {
  originCode.value = codeStr
}
const debounceUpdate = useDebounceFn(onUpdateCode, 500)

const isMobile = useMobile()
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
        <VueCodeMirror
          :value="formatCode"
          :style="{ height: 'calc(100% - 40px);' }"
          @update-code="debounceUpdate"
        />
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
