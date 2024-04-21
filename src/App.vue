<script setup lang="ts">
// import Home from '@/index.vue'
import { Pane, Splitpanes } from 'splitpanes'
import JsonCanvas from '@/components/JsonCanvas.vue'
// import ExportImage from '@/components/ExportImage.vue'
// import NodeDialog from '@/components/NodeDialog.vue'
// import FieldsCustom from '@/components/FieldsCustom.vue'
// import LayoutCustom from '@/components/LayoutCustom.vue'
// import SearchInput from '@/components/SearchInput.vue'
import { useFieldsStore, useJsonStore, useThemeStore } from '@/store'
import { debounce } from '@/utils/debounce'
import { deepFormat } from '@/utils/deepFormat'
import 'splitpanes/dist/splitpanes.css'
const { themeActive, themeList, currentTheme } = toRefs(useThemeStore())
const { fields, isStorage } = toRefs(useFieldsStore())
const { formatJson, originJson } = toRefs(useJsonStore())
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
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
  dropCap: false
})
function openLayoutConfig() {
  drawerVisible.value = !drawerVisible.value
}
const isPaste = ref(false)
const jsonValid = ref(true)

const onJsonChange = debounce((opt, json) => {
  console.log('[ opt ]-46', opt)
  originJson.value = JSON.parse(json)
}, 500)
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
const isExpandEditor = ref(false)
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
function confirmExport(config: any) {
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
      localStorage.setItem("extraFields", JSON.stringify(fields))
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
  (val) => { },
  { deep: true },
)
const extensions = [json()]
function handleReady(editor: any) {
  console.log('[ editor ]-206', editor)
}

function log(opt, e) {
  console.log(opt, e)

}
const code = ref(JSON.stringify(originJson.value, null, 2))
function changJson() {
  code.value = JSON.stringify({
    "name": "张三",
    "age": 18,
  })
}
</script>

<!-- <div class='wh-full'>
  <NodeDialog v-model="showNodeDetail" :node-detail="nodeDetail" />
  <ExportImage v-model="exportVisible" @confirm="confirmExport" />
  <LayoutCustom v-model="drawerVisible" v-model:config="layoutConfig" />
  <FieldsCustom v-model="fieldsVisible" />
</div> -->

<template>
  <Splitpanes class="default-theme" style="height: 100vh">
    <Pane min-size="24" max-size="50" size="30">
      <div border="b gray/20" class="flex items-center px-2  bg-gray/10 h-9 space-x-3">
        <el-tooltip :content="`${isExpandEditor ? '收起' : '展开'}编辑`">
          <span class="iconfont icon-editor-expand" :style="{ transform: `rotate(${editorIconAngle})` }"
            @click="onExpandEditor" />
        </el-tooltip>

        <el-tooltip content="布局配置">
          <span class="iconfont icon-node-layout" @click="openLayoutConfig" />
        </el-tooltip>
        <el-tooltip content="导入JSON">
          <span class="iconfont icon-import-json" @click="onImport" />
        </el-tooltip>
        <el-tooltip content="导出JSON">
          <span class="iconfont icon-export-json" @click="onExport" />
        </el-tooltip>
        <el-tooltip content="解析字段">
          <span class="iconfont icon-zidingyi" @click="openFieldsDialog" />
        </el-tooltip>
        <el-popconfirm title="确定清空JSON?" confirm-button-type="warning" confirm-button-text="确定" cancel-button-text="取消"
          @confirm="confirmClear">
          <template #reference>
            <span class="iconfont icon-clear-json" />
          </template>
        </el-popconfirm>
      </div>

      <codemirror v-model="code" placeholder="Code here..." :style="{ height: '100%' }" :indent-with-tab="true"
        :tab-size="2" :extensions="extensions" @ready="handleReady" @change="onJsonChange('change', $event)"
        @focus="log('focus', $event)" @blur="log('blur', $event)" />
    </Pane>
    <Pane>
      <div h-full>
        <div border="b gray/20" class="flex-between-center  px-2  bg-gray/10 h-10 ">
          <div class='flex-y-center space-x-3'>
            <el-tooltip :content="`${isExpand ? '收起' : '展开'}节点`">
              <span class="iconfont" :class="isExpand ? 'icon-node-collapse' : 'icon-node-expand'" @click="onExpand" />
            </el-tooltip>
            <el-tooltip content="放大">
              <span class="iconfont icon-jia" @click="onZoomOut" />
            </el-tooltip>
            <el-tooltip content="缩小">
              <span class="iconfont icon-jian" @click="onZoomIn" />
            </el-tooltip>
            <el-tooltip content="居中">
              <span class="iconfont icon-center-focus" @click="onAutoZoom" />
            </el-tooltip>
            <el-tooltip content="存为图片">
              <span class="iconfont icon-save-image" @click="showExportImage" />
            </el-tooltip>
            <el-tooltip :content="`${isFullScreen ? '退出' : '进入'}全屏`">
              <span class="iconfont" :class="isFullScreen ? 'icon-exit-fullscreen' : 'icon-enter-fullscreen'
                " @click="onFullScreen" />
            </el-tooltip>

            <el-popover title="主题配色" popper-class="theme-popover" trigger="click">
              <template #reference>
                <span class="iconfont icon-theme" />
              </template>
              <el-select v-model="themeActive" style="width: 124px">
                <el-option v-for="theme in themeList" :key="theme.key" :label="theme.label" :value="theme.key"
                  :style="{ color: theme.color }" />
              </el-select>
            </el-popover>
          </div>
          <SearchInput />
        </div>
        <JsonCanvas ref="jsonCanvasRef" :is-expand="isExpand" :is-expand-editor="isExpandEditor"
          :layout-config="layoutConfig" @node-click="nodeClickHandler" />
      </div>
    </Pane>
  </Splitpanes>
</template>

<style lang="scss" scoped>
* {
  font-size: 13px;
}

.splitpanes {
  &.default-theme {
    .splitpanes__pane {
      background-color: transparent;
    }

    :deep(.splitpanes__splitter) {
      background-color: #f5f5f5 !important;
    }
  }
}

.iconfont {
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0.5;

  &:hover {
    opacity: 1;
    color: #613bd3;
    transform: scale(1.1);
  }
}
</style>
