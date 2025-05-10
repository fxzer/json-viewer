<script setup lang='ts'>
import { useCodeStore, useGlobalStore, useGraphStore } from '@/store'
import { exportJSON, importJSON } from '@/utils'

const FieldsCustom = defineAsyncComponent(() => import('@/components/async/FieldsCustom.vue'))

const LayoutCustom = defineAsyncComponent(() => import('@/components/async/LayoutCustom.vue'))

// 自定义需要额外解析的字段
const fieldsVisible = ref(false)
function openFieldsDialog() {
  fieldsVisible.value = true
}
const drawerVisible = ref(false)
function openLayoutConfig() {
  drawerVisible.value = !drawerVisible.value
}
const { originCode, json, jsonValid } = toRefs(useCodeStore())
const { autoRender } = toRefs(
  useGlobalStore(),
)
const { render } = useGraphStore()
const { toggleExecuteMode } = useGlobalStore()
const editorIconList = [
  {
    icon: 'icon-node-layout',
    content: 'layoutConfig',
    onClick: openLayoutConfig,
  },
  {
    icon: 'icon-zidingyi',
    content: 'parseField',
    onClick: openFieldsDialog,
  },
  {
    icon: 'icon-import-json',
    content: 'import',
    onClick: () => {
      importJSON((json: any) => {
        originCode.value = json
      })
    },
  },
  {
    icon: 'icon-export-json',
    content: 'export',
    onClick: () => exportJSON(json.value),
  },
  {
    icon: 'icon-clear-json',
    content: 'clear',
    onClick: () => {
      originCode.value = ''
    },
  },
]
</script>

<template>
  <div
    border="b gray/20"
    class="h-10 flex items-center bg-gray/10 px-2 space-x-3"
  >
    <template v-for="item, idx in editorIconList" :key="idx">
      <el-tooltip :content="$t(item.content)">
        <span class="iconfont" :class="item.icon" @click="item.onClick" />
      </el-tooltip>
    </template>

    <el-tooltip :content="$t(autoRender ? 'autoRender' : 'manualRender')">
      <span
        class="iconfont icon-auto"
        :class="autoRender ? jsonValid ? '!text-green-500' : '!text-gray-300' : ''"
        @click="toggleExecuteMode()"
      />
    </el-tooltip>
    <el-tooltip content="渲染">
      <Transition name="slide">
        <el-button
          v-show="!autoRender"
          class="iconfont icon-execute"
          :class="[
            !autoRender && jsonValid ? '!text-green-500' : '',
            jsonValid ? '' : '!text-gray-300',
          ]"
          link
          :disabled="!jsonValid"
          @click="render()"
        />
      </Transition>
    </el-tooltip>
  </div>
  <FieldsCustom v-if="fieldsVisible" v-model="fieldsVisible" />
  <LayoutCustom v-if="drawerVisible" v-model="drawerVisible" />
</template>

<style scoped lang='scss'>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.15s ease-in-out;
}

.slide-enter-from {
  transform: translateY(-100%);
}

.slide-leave-to {
  transform: translateY(-100%);
}
</style>
