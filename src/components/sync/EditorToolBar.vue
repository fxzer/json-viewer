<script setup lang='ts'>
import { useCodeStore, useGraphStore } from '@/store'
import { exportJSON, importJSON } from '@/utils'

const ConfigDrawer = defineAsyncComponent(() => import('@/components/async/ConfigDrawer.vue'))

const drawerVisible = ref(false)
function openConfig() {
  drawerVisible.value = !drawerVisible.value
}
const { rawCode, parsedJson, isJsonValid } = toRefs(useCodeStore())
const { autoRender } = toRefs(useGraphStore())
const { render, toggleExecuteMode } = useGraphStore()
const editorIconList = [
  {
    icon: 'icon-config',
    content: 'config',
    onClick: openConfig,
  },
  {
    icon: 'icon-import-json',
    content: 'import',
    onClick: () => {
      importJSON((json: any) => {
        rawCode.value = json
      })
    },
  },
  {
    icon: 'icon-export-json',
    content: 'export',
    onClick: () => exportJSON(parsedJson.value),
  },
  {
    icon: 'icon-clear-json',
    content: 'clear',
    onClick: () => {
      rawCode.value = ''
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
        :class="autoRender ? isJsonValid ? '!text-green-500' : '!text-gray-300' : ''"
        @click="toggleExecuteMode()"
      />
    </el-tooltip>
    <el-tooltip content="渲染">
      <Transition name="slide">
        <el-button
          v-show="!autoRender"
          class="iconfont icon-execute"
          :class="[
            !autoRender && isJsonValid ? '!text-green-500' : '',
            isJsonValid ? '' : '!text-gray-300',
          ]"
          link
          :disabled="!isJsonValid"
          @click="render()"
        />
      </Transition>
    </el-tooltip>
  </div>
  <ConfigDrawer v-if="drawerVisible" v-model="drawerVisible" />
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
