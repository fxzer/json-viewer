<script lang="ts" setup>
import JsonCanvas from '@/views/Home/components/JsonCanvas.vue'
import ExportImage from '@/views/Home/components/ExportImage.vue'
import NodeDialog from '@/views/Home/components/NodeDialog.vue'
import FieldsCustom from '@/views/Home/components/FieldsCustom.vue'
import LayoutCustom from '@/views/Home/components/LayoutCustom.vue'
import SearchInput from '@/views/Home/components/SearchInput.vue'
import { useFieldsStore, useJsonStore, useThemeStore } from '@/store'

import type { ImageConfig } from '@/types/export/image'
import { debounce } from '@/utils/debounce'
import { deepFormat } from '@/utils/deepFormat'

const { themeActive, themeList, currentTheme } = toRefs(useThemeStore())
const { fields, isStorage } = toRefs(useFieldsStore())
const { formatJson, originJson } = toRefs(useJsonStore())

const isDark = useDark()
const toggleDark = useToggle(isDark)

const themeMode = computed(() => {
  if (themeActive.value === 'dark')
    toggleDark(true)
  else
    toggleDark(false)

  return themeActive.value === 'dark' ? 'dark' : 'light'
})

// 布局配置抽屉
const drawerVisible = ref(false)
const layoutConfig = ref({
  type: 'indented',
  direction: 'LR',
  indent: 250,
  dropCap: false,
})
function openLayoutConfig() {
  drawerVisible.value = !drawerVisible.value
}
const isPaste = ref(false)
const jsonValid = ref(true)

const onJsonChange = debounce((json) => {
  originJson.value = json
}, 600)
const onJsonError = debounce((err: Error) => {
  // 如果是粘贴的json格式通过，不提示
  if (jsonValid.value && isPaste.value) {
    isPaste.value = false
    return
  }
  ElNotification({
    type: 'error',
    title: 'JSON语法错误',
    dangerouslyUseHTMLString: true,
    message: `<pre style="white-space: normal;">${err.message}</pre>`,
    duration: 2000,
  })
}, 600)
// 监听剪切板粘贴事件
function onPaste(e: ClipboardEvent) {
  const text = e.clipboardData.getData('text')
  // 验证json格式是否正确
  jsonValid.value = true
  try {
    JSON.parse(text)
    isPaste.value = true
  }
  catch (err) {
    jsonValid.value = false
  }
}
window.addEventListener('paste', onPaste)

// 编辑区展开/收起
const isExpandEditor = ref(true)
const editorIconAngle = ref('0deg')
function onExpandEditor() {
  isExpandEditor.value = !isExpandEditor.value
  editorIconAngle.value = isExpandEditor.value ? '0deg' : '180deg'
}

// 节点展开/收起
const isExpand = ref(true)
function onExpand() {
  isExpand.value = !isExpand.value
}

// 导出json
function onExport() {
  const filename = 'json-viewer.json'
  const jsonStr
    = typeof formatJson.value === 'object'
      ? JSON.stringify(formatJson.value, undefined, 2)
      : formatJson.value
  const blob = new Blob([jsonStr as any], { type: 'text/plain' })
  const link = document.createElement('a')
  link.setAttribute('style', 'display: none')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}
// 导入json
function onImport() {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', '.json')
  input.click()
  input.onchange = () => {
    const file = input.files?.[0]
    if (!file)
      return
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      const json = reader.result
      originJson.value = JSON.parse(json as string)
      if (fields.value.length)
        formatJson.value = deepFormat(JSON.parse(json as string), fields.value)
      else
        formatJson.value = JSON.parse(json as string)
    }
  }
}
// 清空json
function confirmClear() {
  formatJson.value = {} as any
}

const jsonCanvasRef = ref<InstanceType<typeof JsonCanvas>>()
const exportVisible = ref(false)
function showExportImage() {
  exportVisible.value = true
}
function confirmExport(config: ImageConfig) {
  exportVisible.value = false
  const { name, type, padding, backgroundColor } = config
  jsonCanvasRef?.value?.graph?.downloadFullImage(name, type, {
    padding,
    backgroundColor,
  })
}
function onZoomOut() {
  if (jsonCanvasRef?.value)
    (jsonCanvasRef?.value?.toolbar as any).zoomOut()
}
function onZoomIn() {
  if (jsonCanvasRef?.value)
    (jsonCanvasRef?.value?.toolbar as any).zoomIn()
}
function onAutoZoom() {
  if (jsonCanvasRef?.value)
    (jsonCanvasRef?.value?.toolbar as any).autoZoom()
}
// 关键词搜索
const showNodeDetail = ref(false)
const nodeDetail = ref({})
function nodeClickHandler(node: any) {
  nodeDetail.value = node
  showNodeDetail.value = true
}
// 全屏/退出全屏
const isFullScreen = ref(false)
function onFullScreen() {
  isFullScreen.value = !isFullScreen.value
  if (isFullScreen.value)
    document.documentElement.requestFullscreen()
  else
    document.exitFullscreen()
}

// 自定义需要额外解析的字段
const fieldsVisible = ref(false)
function openFieldsDialog() {
  fieldsVisible.value = true
}
// 监听fields变化,重新处理数据画图
watch(
  () => fields.value,
  (fields) => {
    // 重新处理数据
    formatJson.value = deepFormat(originJson.value, fields)
    if (isStorage.value)
      localStorage.setItem('extraFields', JSON.stringify(fields))
    else
      localStorage.removeItem('extraFields')
  },
  { deep: true },
)
watch(
  () => originJson.value,
  (val) => {
    formatJson.value = deepFormat(val, fields.value)
  },
  { deep: true },
)
watch(
  () => formatJson.value,
  (val) => {},
  { deep: true },
)
</script>

<template>
  <div class="json-home" :class="themeMode">
    <!-- 左侧工具导航栏 -->
    <div class="nav-tools">
      <img class="jv-logo" src="/favicon.svg">
      <div class="tool-btns">
        <el-tooltip
          :content="`${isExpandEditor ? '收起' : '展开'}编辑`"
          placement="right"
        >
          <span
            class="iconfont icon-editor-expand"
            :style="{ transform: `rotate(${editorIconAngle})` }"
            @click="onExpandEditor"
          />
        </el-tooltip>

        <el-tooltip content="布局配置" placement="right">
          <span
            class="iconfont icon-node-layout"
            @click="openLayoutConfig"
          />
        </el-tooltip>
        <el-tooltip
          :content="`${isExpand ? '收起' : '展开'}节点`"
          placement="right"
        >
          <span
            class="iconfont"
            :class="isExpand ? 'icon-node-collapse' : 'icon-node-expand'"
            @click="onExpand"
          />
        </el-tooltip>
        <el-tooltip
          :content="`${isFullScreen ? '退出' : '进入'}全屏`"
          placement="right"
        >
          <span
            class="iconfont"
            :class="
              isFullScreen ? 'icon-fullscreen-cancel' : 'icon-fullscreen-done'
            "
            @click="onFullScreen"
          />
        </el-tooltip>
        <el-tooltip content="导入JSON" placement="right">
          <span class="iconfont icon-import-json" @click="onImport" />
        </el-tooltip>
        <el-tooltip content="导出JSON" placement="right">
          <span class="iconfont icon-export-json" @click="onExport" />
        </el-tooltip>
        <el-tooltip content="解析字段" placement="right">
          <span class="iconfont icon-zidingyi" @click="openFieldsDialog" />
        </el-tooltip>
        <el-popover
          placement="right"
          title="主题配色"
          popper-class="theme-popover"
          trigger="click"
        >
          <template #reference>
            <span class="iconfont icon-theme" />
          </template>
          <el-select v-model="themeActive" style="width: 124px">
            <el-option
              v-for="theme in themeList"
              :key="theme.key"
              :label="theme.label"
              :value="theme.key"
              :style="{ color: theme.color }"
            />
          </el-select>
        </el-popover>

        <el-popconfirm
          title="确定清空JSON?"
          confirm-button-type="warning"
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="confirmClear"
        >
          <template #reference>
            <!-- <el-tooltip content="清空JSON" placement="right" >   -->
            <span class="iconfont icon-clear-json" />
            <!-- </el-tooltip> -->
          </template>
        </el-popconfirm>
      </div>
    </div>
    <!-- 右侧操作区 -->
    <div class="main-wrap">
      <!-- json编辑区域 -->
      <div
        class="json-wrap"
        :style="{
          width: isExpandEditor ? '450px' : '0px',
          zIndex: isExpandEditor ? 1 : -1,
        }"
      >
        <div class="wrap-title top-title">
          JSON内容
        </div>

        <!-- JSON编辑组件 -->
        <VueJsonEditor
          v-model="formatJson"
          class="edit-area"
          mode="code"
          :show-btns="false"
          @json-change="onJsonChange"
          @has-error="onJsonError"
        />
      </div>
      <!-- json画布区域 -->
      <div class="json-canvas">
        <div class="canvas-tools top-title">
          <div class="opt-btns">
            <el-tooltip content="放大" placement="bottom">
              <span class="iconfont icon-plus" @click="onZoomOut" />
            </el-tooltip>
            <el-tooltip content="缩小" placement="bottom">
              <span class="iconfont icon-minus" @click="onZoomIn" />
            </el-tooltip>
            <el-tooltip content="居中" placement="bottom">
              <span class="iconfont icon-auto-zoom" @click="onAutoZoom" />
            </el-tooltip>
            <el-tooltip content="存为图片" placement="bottom">
              <span
                class="iconfont icon-save-image"
                @click="showExportImage"
              />
            </el-tooltip>
          </div>
          <SearchInput />
        </div>
        <JsonCanvas
          ref="jsonCanvasRef"
          :is-expand="isExpand"
          :is-expand-editor="isExpandEditor"
          :layout-config="layoutConfig"
          @node-click="nodeClickHandler"
        />
      </div>
    </div>
    <NodeDialog v-model="showNodeDetail" :node-detail="nodeDetail" />
    <ExportImage v-model="exportVisible" @confirm="confirmExport" />
    <LayoutCustom v-model="drawerVisible" v-model:config="layoutConfig" />
    <FieldsCustom v-model="fieldsVisible" />
  </div>
</template>

<style scoped lang="scss">
$bg-color: v-bind("currentTheme.bgcolor");
$color: v-bind("currentTheme.color");
$hover-color: v-bind("currentTheme.hcolor");
$hb-color: v-bind("currentTheme.hbcolor");
.json-home {
  width: 100%;
  height: 100%;
  display: flex;
  @import "./styles/nav.scss";

  .main-wrap {
    flex: 1;
    display: flex;
    .top-title {
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      background-color: $bg-color;
      color: $color;
      z-index: 2;
      box-shadow: 3px 3px 3px $hb-color;
    }
    @import "./styles/editor.scss";
    @import "./styles/canvas.scss";

  }
}
@import "./styles/dark.scss";
@import "./styles/phone.scss";
</style>
