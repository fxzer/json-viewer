<script setup lang="ts">
import { toggleDarkAnimate } from '@/hooks'
import { Pane, Splitpanes } from 'splitpanes'
import { useGlobalStore} from '@/store'
import { deepFormat } from '@/utils/deepFormat'
import 'splitpanes/dist/splitpanes.css'

const { fields,formatJson, originJson} = toRefs(useGlobalStore())
const isDark = useDark()

const drawerVisible = ref(false)
function openLayoutConfig() {
  drawerVisible.value = !drawerVisible.value
}
const code = ref(JSON.stringify(originJson.value, null, 2))


const jsonValid = ref(true)
watchDebounced(code, (codeStr) => {
  if (!codeStr) {
    formatJson.value = {}
    return
  }
  try {
    const mybeObj = JSON.parse(codeStr)
    const isObj = Object.prototype.toString.call(mybeObj) === '[object Object]'
    jsonValid.value = isObj
    if (isObj) {
      originJson.value = mybeObj
    } else {
      ElNotification({
        type: 'error',
        title: 'JSON格式错误',
        message: '请输入正确的JSON格式',
        duration: 2000,
      })
    }
  }
  catch (err) {
    jsonValid.value = false
    ElNotification({
      type: 'error',
      title: 'JSON语法错误',
      dangerouslyUseHTMLString: true,
      message: `<pre style="white-space: normal;">${err.message}</pre>`,
      duration: 2000,
    })
  }

}, { debounce: 500, })

const autoExecute = ref(false)
function toggleExecuteMode() {
  autoExecute.value = !autoExecute.value
}
function execute() {
  const codeObj = JSON.parse(code.value)
  formatJson.value = deepFormat(codeObj, fields.value)
}
// 编辑区展开/收起
// const isExpandEditor = ref(false)
// const editorIconAngle = ref('0deg')
// function onExpandEditor() {
//   isExpandEditor.value = !isExpandEditor.value
//   editorIconAngle.value = isExpandEditor.value ? '0deg' : '180deg'
// }

// 节点展开/收起
const [   isExpandEditor ,toggleEditor ] = useToggle(true)
const [   isExpand ,toggleNode ] = useToggle(true)
const editorSize = computed(() => isExpandEditor.value ? 30 : 0)
const canvasSize = computed(() => isExpandEditor.value ? 70 : 100)
watch(isExpand,(val)=>{
  console.log(val)
})
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
  code.value = ''
}

const jsonCanvasRef = ref()
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
const nodeDetailVisible = ref(false)
const nodeDetail = ref({})
function nodeClickHandler(node: any) {
  nodeDetail.value = node
  nodeDetailVisible.value = true
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
  },
  { deep: true },
)
watch(
  () => originJson.value,
  (val) => {
    if (autoExecute.value) {
      formatJson.value = deepFormat(val, fields.value)
    }
  },
  { deep: true },
)
watch(
  () => formatJson.value,
  (val) => { },
  { deep: true },
)
</script>



<template>
  <div>
    <Splitpanes class="default-theme" style="height: 100vh">
      <Pane  max-size="50" :size="editorSize">
        <div border="b gray/20" class="flex items-center px-2  bg-gray/10 h-9 space-x-3">
          

          <el-tooltip content="布局配置">
            <span class="iconfont icon-node-layout" @click="openLayoutConfig" />
          </el-tooltip>
          <el-tooltip content="解析字段">
            <span class="iconfont icon-zidingyi" @click="openFieldsDialog" />
          </el-tooltip>
          <el-tooltip content="导入JSON">
            <span class="iconfont icon-import-json" @click="onImport" />
          </el-tooltip>
          <el-tooltip content="导出JSON">
            <span class="iconfont icon-export-json" @click="onExport" />
          </el-tooltip>

          <el-popconfirm title="确定清空JSON?" confirm-button-type="warning" confirm-button-text="确定"
            cancel-button-text="取消" @confirm="confirmClear">
            <template #reference>
              <span class="iconfont icon-clear-json" />
            </template>
          </el-popconfirm>
          <el-tooltip content="自动渲染">
            <span class="iconfont icon-auto" @click="toggleExecuteMode" :class="autoExecute ? '!text-green-500' : ''" />
          </el-tooltip>
          <el-tooltip content="渲染">
            <Transition name="slide">
              <el-button class="iconfont icon-execute" v-show="!autoExecute" @click="execute" :class="[
                !autoExecute && jsonValid ? '!text-green-500' : '',
                jsonValid ? '' : '!text-gray-300'
              ]" link :disabled="!jsonValid" />
            </Transition>
          </el-tooltip>
        </div>

        <VueCodeMirror v-model="code" :style="{ height: '100%' }" />
      </Pane>
      <Pane :size="canvasSize">
        <div h-full>
          <div border="b gray/20" class="flex-between-center  px-2  bg-gray/10 h-10 ">
            <div class='flex-y-center space-x-3'>
              <el-tooltip :content="`${isExpandEditor ? '收起' : '展开'}编辑`">
            <span class="iconfont icon-editor-expand" :style="{ transform: `rotate(${isExpandEditor?'0deg':'180deg'})` }"
              @click="toggleEditor()" />
          </el-tooltip>
              <el-tooltip :content="`${isExpand ? '收起' : '展开'}节点`">
                <span class="iconfont" :class="isExpand ? 'icon-node-collapse' : 'icon-node-expand'"
                  @click="toggleNode()" />
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
              <span class="iconfont" @click="toggleDarkAnimate" :class="isDark ? 'icon-night' : 'icon-day'" />
              <ColorPicker>
                <template #icon>
                  <span class="iconfont icon-theme" />
                </template>
              </ColorPicker>
            </div>
            <SearchInput />
          </div>
          <JsonCanvas ref="jsonCanvasRef" :is-expand="isExpand" :is-expand-editor="isExpandEditor"
             @node-click="nodeClickHandler" />
        </div>
      </Pane>
    </Splitpanes>
    <ExportImage v-model="exportVisible" @confirm="confirmExport" />
    <FieldsCustom v-model="fieldsVisible" />
    <NodeDialog v-model="nodeDetailVisible" :node-detail="nodeDetail" />
    <LayoutCustom v-model="drawerVisible" />
  </div>

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
      background-color: #d1d5db26;
      border-left: 1px solid #d1d5db26 !important;
    }

  }
}

.iconfont {
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  color: #9ca3af;

  &:hover {
    color: #222;
  }
}

.dark .iconfont:hover {
  color: #fff;
  // color:#9ca3af88
}

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
