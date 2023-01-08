<template>
  <div class="json-home" :class="themeMode">
    <!-- 左侧工具导航栏 -->
    <div class="nav-tools">
      <div class="jv-icon">
        <span class="char-j">J</span><span class="char-v">V</span>
      </div>
      <div class="tool-btns">
        <el-tooltip :content="(isExpandEditor ? '收起':'展开') +'编辑'" placement="right" >
          <span
            class="iconfont icon-editor-expand"
            :style="{ transform: `rotate(${editorIconAngle})` }"
            @click="onExpandEditor"
          ></span>
        </el-tooltip>

        <el-tooltip content="布局配置" placement="right"  >
          <span
            class="iconfont icon-node-layout"
            @click="openLayoutConfig"
          ></span>
        </el-tooltip>
        <el-tooltip
          :content="(isExpand ? '收起' : '展开')+ '节点'"
          placement="right"
          
        >
          <span
            class="iconfont"
            :class="isExpand ? 'icon-node-collapse' : 'icon-node-expand'"
            @click="onExpand"
          ></span>
        </el-tooltip>
        <el-tooltip
          :content="(isFullScreen ? '退出' : '进入')+ '全屏'"
          placement="right" 
        >
          <span
            class="iconfont"
            :class="isFullScreen ? 'icon-fullscreen-cancel' : 'icon-fullscreen-done'"
            @click="onFullScreen"
          ></span>
        </el-tooltip>
        <el-tooltip content="导入JSON" placement="right" >
          <span class="iconfont icon-import-json" @click="onImport"></span>
        </el-tooltip>
        <el-tooltip content="导出JSON" placement="right" >
          <span class="iconfont icon-export-json" @click="onExport"></span>
        </el-tooltip>
        <el-tooltip content="解析字段" placement="right" >
          <span class="iconfont icon-zidingyi" @click="openFieldsDialog"></span>
        </el-tooltip>
        <el-popover
            ref="popover"
            placement="right"
            title="主题配色"
            popper-class="theme-popover"
            trigger="click"
            
          >
            <template #reference>
              <span class="iconfont icon-theme"  ></span>
            </template>
            <el-select v-model="themeActive"  style="width:124px">
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
          @cancel="cancelClear"
        >
          <template #reference>
            <!-- <el-tooltip content="清空JSON" placement="right" > -->
            <span class="iconfont icon-clear-json"  ></span>
            <!-- </el-tooltip> -->  
          </template>
        </el-popconfirm>
      </div>
    </div>
    <!-- 右侧操作区 -->
    <div class="opt-wrap" >
      <!-- json编辑区域 -->
      <div class="json-wrap" :style="{
      width: isExpandEditor ? '450px' : '0px',
      zIndex: isExpandEditor ? 1 : -1,
    }">
        <div class="wrap-title top-title">JSON内容</div>
        <VueJsonEditor
          class="edit-area"
          v-model="jsonData"
          :mode="'code'"
          :show-btns="false"
          @json-change="onJsonChange"
          @has-error="onJsonError"
        />
      </div>
      <!-- json画布区域 -->
      <div class="json-canvas">
        <div class="canvas-tools top-title">
          <div class="opt-btns">
            <el-tooltip
              content="放大"
              placement="bottom"
              
            >
            <span class="iconfont icon-plus" @click="onZoomOut"></span>
            </el-tooltip>
            <el-tooltip
              content="缩小"
              placement="bottom"
              
            >
            <span class="iconfont icon-minus" @click="onZoomIn"></span>
            </el-tooltip>
            <el-tooltip
              content="居中"
              placement="bottom"
               
            >
            <span class="iconfont icon-auto-zoom" @click="onAutoZoom"></span>
            </el-tooltip>
            <el-tooltip
              content="存为图片"
              placement="bottom"
              
            >
            <span class="iconfont icon-save-image" @click="showExportImage"></span>
            </el-tooltip>
          </div>
          <div class="search-wrap">
            <input
              class="search-input"
              type="text"
              placeholder="请输入节点名称"
              v-model="searchKeyWord"
              @input="onSearch"
            />
            <span class="iconfont icon-search"></span>
          </div>
        </div>
        <JsonCanvas
          v-model="jsonData"
          :layoutDirection="layoutDirection"
          :isExpand="isExpand"
          :isExpandEditor="isExpandEditor"
          ref="jsonCanvasRef"
          @node-click="nodeClickHandler"
          :extraFields="extraFields"
          :layoutConfig="layoutConfig"
        />
      </div>
    </div>
    <NodeDialog v-model:value="showNodeDetail" :nodeDetail="nodeDetail"/>
    <ExportImage v-model:value="exportVisible" @confirm="confirmExport" />
    <LayoutCustom v-model:value="drawerVisible" v-model:config="layoutConfig"  />
    <FieldsCustom v-model:value="fieldsVisible" :fields="extraFields" @update:fields="updateFields" />
  </div>
</template>

<script lang="ts" setup>
//TODO:导入路径问题
import JsonCanvas from "@/views/Home/components/JsonCanvas.vue";
import ExportImage from "@/views/Home/components/ExportImage.vue";
import NodeDialog from '@/views/Home/components/NodeDialog.vue'
import FieldsCustom from '@/views/Home/components/FieldsCustom.vue'
import LayoutCustom from '@/views/Home/components/LayoutCustom.vue'
import { computed, ref, toRefs } from "vue";
import useStore from "@/store";
const { theme } = useStore();
const { themeActive, themeList,currentTheme } = toRefs(theme);

import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()
const toggleDark = useToggle(isDark)

const themeMode = computed(() => {
  if(themeActive.value === "dark"){
    toggleDark(true)
    console.log("%c [ toggleDark(true) ]-192", "font-size:14px; background:#2b6415; color:#6fa859;", toggleDark(true));
  }else{
    toggleDark(false)
  }
  return themeActive.value === "dark" ? "dark" : "light";
});
let jsonData = ref({
  "state": "Done",
  "createdDate": "Jan 5, 2023 1:13:21 PM",
  "finishedDate": "Jan 5, 2023 1:13:21 PM",
  "name":["list","wangwu"]
});
//布局配置抽屉
const drawerVisible = ref(false)
const layoutConfig = ref({
    type: "indented",
    direction: "LR", 
    indent: 250,
    dropCap: false,
})
const openLayoutConfig = () => {
  drawerVisible.value =  !drawerVisible.value
}
const onJsonChange = (json: any) => {
  jsonData.value = json;
};
const onJsonError = (err: any) => {
  ElNotification({
    title: "语法错误",
    message: err.message,
    type: "error",
    duration: 6000,
  });
};
const updateFields =  (fields: any,isStorage:boolean) => {
  extraFields.value = fields
  localStorage.setItem('isStorage',JSON.stringify(isStorage))
  let str = isStorage ? JSON.stringify(fields) : ''
  localStorage.setItem('extraFields',str)
}
//编辑区展开/收起
const isExpandEditor = ref(true);
const editorIconAngle = ref("0deg");
const onExpandEditor = () => {
  isExpandEditor.value = !isExpandEditor.value
  editorIconAngle.value = isExpandEditor.value ? "0deg" : "180deg";
};

//TODO:默认展开几级
const isExpand = ref(true);
const onExpand = () => {
  isExpand.value = !isExpand.value;
};

//旋转布局
const layoutDirection = ref("LR");
const rotateAngle = ref("0deg");
const onRotate = () => {
  const layouts = {
    LR: "0deg",
    H: "90deg",
    RL: "180deg",
  };
  //轮流旋转
  let keys = Object.keys(layouts);
  //获取下一个方向的索引,并取到所对应的旋转角度
  let index = (keys.indexOf(layoutDirection.value) + 1) % keys.length;
  layoutDirection.value = keys[index];
  rotateAngle.value = layouts[layoutDirection.value];
};
//导出json
const onExport = () => {
  const filename = `json-viewer.json`;
  const jsonStr =
    typeof jsonData.value === "object"
      ? JSON.stringify(jsonData.value, undefined, 2)
      : jsonData.value;
  const blob = new Blob([jsonStr as any], { type: "text/plain" });
  const link = document.createElement("a");
  link.setAttribute("style", "display: none");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
//导入json
const onImport = () => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", ".json");
  input.click();
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const json = reader.result;
      jsonData.value = JSON.parse(json as string);
    };
  };
};
//清空json
const confirmClear = () => {
  jsonData.value = {} as any;
};
const cancelClear = () => {};

//TODO:保存为图片拓展
const jsonCanvasRef = ref(null);
const exportVisible  = ref(false)

const showExportImage = () => {
  exportVisible.value = true
};


const confirmExport = (config) => {
  exportVisible.value = false
  if (jsonCanvasRef?.value) {
    let { name, type ,padding,backgroundColor} = config;
    (jsonCanvasRef?.value as any).graph.downloadFullImage(name,type, {
      padding,
      backgroundColor,
    });
  }
};
const onZoomOut = () => {
  if (jsonCanvasRef?.value) {
    (jsonCanvasRef?.value?.toolbar as any).zoomOut();
  }
};
const onZoomIn = () => {
  if (jsonCanvasRef?.value) {
    (jsonCanvasRef?.value?.toolbar as any).zoomIn();
  }
};
const onAutoZoom = () => {
  if (jsonCanvasRef?.value) {
    (jsonCanvasRef?.value?.toolbar as any).autoZoom();
  }
};
//关键词搜索
const searchKeyWord = ref("");
//防抖函数
const debounce = (func, deply = 500) => {
  // 缓存一个定时器id
  let timer = 0
  return function(...args) {
    if (timer) {}
    timer = setTimeout(() => {
      func.apply(this, args)
    }, deply)
  }
}

//TODO:防抖没有生效
const onSearch = (e) => {
  if (jsonCanvasRef?.value) {
   debounce(jsonCanvasRef?.value.focusNode, 600)(e.target.value) 
  }
};

const showNodeDetail = ref(false);
const nodeDetail = ref({});
const nodeClickHandler = (node: any) => {
  nodeDetail.value = node;
  showNodeDetail.value = true;
};
//全屏/退出全屏
const isFullScreen = ref(false);
const onFullScreen = () => {
  isFullScreen.value = !isFullScreen.value;
  if (isFullScreen.value) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

//自定义需要额外解析的字段
const extraFields = ref([]);
const fieldsVisible = ref(false) 
const openFieldsDialog = () => {
  fieldsVisible.value = true
}
</script>
<style scoped lang="scss">
$bg-color: v-bind('currentTheme.bgcolor');
$color: v-bind('currentTheme.color');
$hover-color: v-bind('currentTheme.hcolor');
$hb-color: v-bind('currentTheme.hbcolor');
.json-home {
  width: 100%;
  height: 100%;
  display: flex;
  
  //左侧工具导航栏
  .nav-tools {
    min-width: 50px;
    height: 100%;
    z-index: 2;
    background-color: $bg-color;

    .jv-icon {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: #c09af7;
      font-size: 20px;
      font-weight: 600;
      //斜体
      font-style: italic;
      //字体阴影
      text-shadow: 0 0px 2px $bg-color;
      letter-spacing: 4px;
      position: relative;
      .char-j {
        color: #a845f5;
      }
      .char-v {
        color: #f5c146;
      }
      &::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        bottom: 1px;
        width: 80%;
        height: 1px;
        background-color: $bg-color;
      }
    }
    //  工具按钮
    .tool-btns {
      display: flex;
      flex-direction: column;
      padding: 10px;
      .iconfont {
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: $color;
        font-size: 20px;
        margin: 5px 0;
        cursor: pointer;
        transition: all 0.2s;
        border-radius: 4px;
        &:hover {
          transform: scale(1.1);
          color: $hover-color;
          background-color: $hb-color;
        }
      }
     
    }
  }
  .opt-wrap {
    flex: 1;
    display: flex;
    .top-title {
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      background-color: $bg-color;
      color: $color;
      z-index: 2;
      box-shadow:4px 0px  8px $hb-color;
    }
    //json编辑区域
    .json-wrap {
      width: 450px;
      display: flex;
      flex-direction: column;
      transition:all .3s ease-in-out;
      .edit-area {
        flex: 1;
        //样式穿透
        &:deep(.jsoneditor-vue) {
          height: 100%;
          //自定义编辑器主题
          & div.jsoneditor {
            border-color: $color;
            .jsoneditor-outer {
              height: calc(100% + 35px)!important;
              .ace_gutter {
                background-color:#ebebeb20;
              }
              & .ace_folding-enabled   .ace_gutter-cell {
                background-color:#ebebeb20;
              }
            }
            .jsoneditor-menu {
              display: none;
            }
          }
        }
      }
    }
    // json画布区域
    .json-canvas {
      flex: 1;
      height: 100%;
      font-size: 0; //去除空白
      background-color: #fff;
      display: flex;
      flex-direction: column;
      .canvas-tools {
        display: flex;
        line-height: 40px;
        min-height: 40px !important;
        .opt-btns {
          display: flex;
          align-items: center;
          .iconfont {
            line-height: 30px;
            height: 30px;
            padding: 0 5px;
            text-align: center;
            color: $color;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.2s;
            border-radius: 4px;
            &:hover {
              transform: scale(1.06);
              color: $hover-color;
              background-color: $hb-color;
            }
          }
        }
        .search-wrap {
          display: flex;
          align-items: center;
          width: 180px;
          height: 30px;
          position: absolute;
          right:20px;
          top:5px;
          .search-input {
            display: inline-block;
            height: 100%;
            width: 100%;
            outline: none;
            padding: 2px 6px;
            padding-right:26px;
            background-color: $hb-color;
            border-radius: 4px;
            border: none;
            color:v-bind('currentTheme.color');
            &::placeholder {
              color:v-bind('currentTheme.color');
              opacity: 0.6;
            }
          }
          .icon-search {
            position: absolute;
            right: 8px;
            color: $hover-color;
            opacity: 0.8;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.2s;
            &:hover {
              transform: scale(1.1);
              opacity: 1;
            }
          }
        }
      }
      .canvas-area {
        flex: 1;
      }
    }
  }
 
}
@import './dark.scss';
</style>
