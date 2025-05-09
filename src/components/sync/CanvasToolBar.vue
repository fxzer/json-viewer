<script setup lang='ts'>
import { toggleDarkAnimate, useMobile } from '@/hooks'
import { useGlobalStore, useGraphStore } from '@/store'

const ExportImage = defineAsyncComponent(() => import('@/components/async/ExportImage.vue'))
const { zoomBy, fitView, toggleNode } = useGraphStore()
const { ratioText, isExpandNode } = storeToRefs(useGraphStore())
const { toggleEditor, toggleLanguage } = useGlobalStore()
const { isDark, isExpandEditor } = toRefs(useGlobalStore())
const isMobile = useMobile()
// 节点展开/收起
const editorIconStyle = computed(() => {
  const rotateAngle = isMobile.value
    ? isExpandEditor.value ? '90deg' : '270deg'
    : isExpandEditor.value ? '0deg' : '180deg'

  return { transform: `rotate(${rotateAngle})` }
})

const { isFullscreen, toggle } = useFullscreen()

const exportVisible = ref(false)
const canvasIconList = [
  {
    icon: 'icon-jia',
    content: 'zoomIn',
    onClick: () => zoomBy(1.2),
  },
  {
    icon: 'icon-jian',
    content: 'zoomOut',
    onClick: () => zoomBy(0.8),
  },
  {
    icon: 'icon-center-focus',
    content: 'center',
    onClick: fitView,
  },
  {
    icon: 'icon-save-image',
    content: 'saveImage',
    onClick: () => exportVisible.value = true,
  },
  {
    icon: 'icon-language',
    content: 'language',
    onClick: toggleLanguage,
  },
]
</script>

<template>
  <div
    border="b gray/20"
    class="bg-gray/10 px-2 md:(h-10 flex-between-center)"
  >
    <div class="flex-y-center space-x-3">
      <el-tooltip
        :content="`${
          isExpandEditor ? $t('collapse') : $t('expand')
        }${$t('editor')}`"
      >
        <span
          class="iconfont icon-editor-expand"
          :style="editorIconStyle"
          @click="toggleEditor()"
        />
      </el-tooltip>

      <el-tooltip
        :content="`${isExpandNode ? $t('collapse') : $t('expand')}${$t(
          'nodes',
        )}`"
      >
        <span
          class="iconfont"
          :class="
            isExpandNode ? 'icon-node-collapse' : 'icon-node-expand'
          "
          @click="toggleNode()"
        />
      </el-tooltip>

      <template v-for="item, idx in canvasIconList" :key="idx">
        <el-tooltip :content="$t(item.content)">
          <span
            class="iconfont"
            :class="item.icon"
            @click="item.onClick"
          />
        </el-tooltip>
      </template>

      <el-tooltip
        :content="`${isFullscreen ? $t('exit') : $t('enter')}${$t(
          'fullscreen',
        )}`"
      >
        <span
          class="iconfont"
          :class="
            isFullscreen
              ? 'icon-exit-fullscreen'
              : 'icon-enter-fullscreen'
          "
          @click="toggle"
        />
      </el-tooltip>
      <span
        class="iconfont"
        :class="isDark ? 'icon-night' : 'icon-day'"
        @click="toggleDarkAnimate"
      />
      <div op60>
        {{ ratioText }}
      </div>
    </div>
    <SearchInput />
  </div>
  <ExportImage v-if="exportVisible" v-model="exportVisible" />
</template>

<style scoped lang='scss'>

</style>
