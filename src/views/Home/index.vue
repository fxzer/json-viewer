<template>
  <div class="json-home">
    <!-- 左侧工具导航栏 -->
    <div class="nav-tools">
      <div class="jv-icon">
        <span class="char-j">J</span><span class="char-v">V</span>
      </div>
      <div class="tool-btns">
        <el-tooltip content="展开编辑" placement="top" effect="dark">
          <span class="iconfont icon-zhankai-"></span>
        </el-tooltip>

        <el-tooltip content="旋转布局" placement="right" effect="light">
          <span
            class="iconfont icon-node-layout-1"
            :style="{ transform: `rotate(${rotateAngle})` }"
            @click="onRotate"
          ></span>
        </el-tooltip>

        <el-tooltip
          :content="isExpand ? '收起' : '展开'"
          placement="right"
          effect="light"
        >
          <span
            class="iconfont"
            :class="isExpand ? 'icon-node-collapse' : 'icon-node-expand'"
            @click="onExpand"
          ></span>
        </el-tooltip>
        <el-tooltip content="导入" placement="right" effect="light">
          <span class="iconfont icon-import" @click="onImport"></span>
        </el-tooltip>
        <el-tooltip content="导出" placement="right" effect="light">
          <span class="iconfont icon-export-json" @click="onExport"></span>
        </el-tooltip>
        <!-- <el-tooltip content="清空" placement="right" effect="light">  -->

        <el-popconfirm
          title="确定清空JSON?"
          confirm-button-type="warning"
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="confirmClear"
          @cancel="cancelClear"
        >
          <template #reference>
            <span class="iconfont icon-clear-json"></span>
          </template>
        </el-popconfirm>
        <!-- </el-tooltip> -->
      </div>
    </div>
    <!-- 右侧操作区 -->
    <div class="opt-wrap">
      <!-- json编辑区域 -->
      <div class="json-wrap">
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
            <span class="iconfont icon-plus" @click="onZoomOut"></span>
            <span class="iconfont icon-jianhao" @click="onZoomIn"></span>
            <span class="iconfont icon-xueyuan-shousuo" @click="onAutoZoom"></span>
            <!-- <span class="iconfont icon-quanping"></span>
            <span class="iconfont icon-quxiaoquanping"></span> -->
            <span class="iconfont icon-save" @click="saveAsImage"></span>
          </div>
          <div class="search-wrap">
            <input
              class="search-input"
              type="text"
              placeholder="请输入节点名称"
            />
            <span class="iconfont icon-search"></span>
          </div>
        </div>
        <JsonCanvas
          v-model="jsonData"
          :layoutDirection="layoutDirection"
          :isExpand="isExpand"
          ref="jsonCanvasRef"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as V3JsonEditor from "vue3-json-editor";
import JsonCanvas from "@/views/Home/components/JsonCanvas.vue";
import { ElNotification, roleTypes } from "element-plus";
import { ref } from "vue";
const VueJsonEditor = V3JsonEditor.Vue3JsonEditor;
let jsonData = ref({
  name: "json-viewer",
  private: true,
  version: "0.0.0",
  type: "module",
  scripts: {
    dev: "vite",
    build: "vite build",
    preview: "vite preview",
  },
  dependencies: {
    "@antv/g6": "^4.8.1",
    "element-plus": "^2.2.28",
    vue: "^3.2.45",
    "vue3-json-editor": "^1.1.5",
  },
  devDependencies: {
    "@vitejs/plugin-vue": "^4.0.0",
    sass: "^1.57.1",
    "unplugin-auto-import": "^0.12.1",
    "unplugin-vue-components": "^0.22.12",
    vite: "^4.0.0",
  },
});
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
const saveAsImage = () => {
  console.log("保存为图片");
  if(jsonCanvasRef?.value){
    (jsonCanvasRef?.value as any).saveImage()
  }
};
const onZoomOut = () => {
  if(jsonCanvasRef?.value ){
    (jsonCanvasRef?.value?.toolbar as any).zoomOut()
  }
};
const onZoomIn = () => {
  if(jsonCanvasRef?.value ){
    (jsonCanvasRef?.value?.toolbar as any).zoomIn()
  }
};
const onAutoZoom = () => {
  if(jsonCanvasRef?.value ){
    (jsonCanvasRef?.value?.toolbar as any).autoZoom()
  }
};
</script>
<style scoped lang="scss">
$json-edit-bgc: #f1f4f5;
$json-edit-primary: #7b6fdd;
$nav-bgc: #ebebeb;
$nav-color: #a278dc;
$hover-color: #7b6fdd;
.json-home {
  width: 100%;
  height: 100%;
  display: flex;
  //左侧工具导航栏
  .nav-tools {
    width: 50px;
    height: 100%;
    background-color: $nav-bgc;
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
      text-shadow: 0 0px 2px $nav-bgc;
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
        background-color: $nav-bgc;
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
        color: $nav-color;
        font-size: 20px;
        margin: 5px 0;
        cursor: pointer;
        transition: all 0.2s;
        border-radius: 4px;
        &:hover {
          transform: scale(1.1);
          color: $hover-color;
          background-color: #fff;
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
      background-color: $nav-bgc;
      color: $nav-color;
    }
    //json编辑区域
    .json-wrap {
      width: 450px;
      display: flex;
      flex-direction: column;
      .edit-area {
        flex: 1;
        //样式穿透
        &:deep(.jsoneditor-vue) {
          height: 100%;
          //自定义编辑器主题
          & div.jsoneditor {
            border-color: $json-edit-primary;
            .jsoneditor-outer {
              .ace_gutter {
                background-color: $json-edit-bgc;
              }
            }
            .jsoneditor-menu {
              color: $json-edit-primary;
              background-color: $json-edit-bgc;
              border-bottom: 1px solid $json-edit-bgc;
              & > button {
                background-color: $json-edit-primary;
                opacity: 0.7;
                cursor: pointer;
                &:hover {
                  opacity: 1;
                }
              }
              & > button.jsoneditor-undo,
              button.jsoneditor-redo {
                opacity: 1;
                background-color: transparent !important;
              }
              & > div.jsoneditor-modes{
                 & > button {
                color: #333 !important;
                }
                .jsoneditor-contextmenu{
                  left: 9px!important;
                  top:30px !important;
                  width:58px !important;
                  ul {
                    width: 100% !important;
                    .jsoneditor-type-modes{
                      width:58px !important;
                      text-align: center;
                      .jsoneditor-icon{
                        display: none;
                      }
                    }
                  }
                }
              }
              
              & > div.jsoneditor-modes .jsoneditor-separator {
                background: #fff;
                border-radius: 3px;
                display: inline-block;
                width: 58px !important;
                height: 26px !important;
                padding: 0 !important;
                cursor: pointer;
                &:hover {
                  color:#222;
                }
              }
              & a.jsoneditor-poweredBy {
                display: none !important;
              }
              &.jsoneditor-menu .jsoneditor-selected {
                background-color: $json-edit-primary;
                color: #fff;
              }
              & table.jsoneditor-search div.jsoneditor-results {
                color: $json-edit-primary;
              }
              & table.jsoneditor-search input {
                color: #444;
                padding-left: 3px;
              }
              & .ace_folding-enabled > .ace_gutter-cell {
                background-color: $json-edit-bgc;
              }
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
        justify-content: space-between;
        line-height: 40px;
        .opt-btns {
          display: flex;
          align-items: center;
          .iconfont {
            line-height: 30px;
            height: 30px;
            padding: 0 5px;
            text-align: center;
            color: $nav-color;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.2s;
            border-radius: 4px;
            &:hover {
              transform: scale(1.06);
              color: $hover-color;
              background-color: #fff;
            }
          }
        }
        .search-wrap {
          position: relative;
          display: flex;
          align-items: center;
          padding: 5px 0;
          width: 180px;
          .search-input {
            display: inline-block;
            height: 100%;
            width: 100%;
            outline: none;
            padding: 2px 6px;
            background-color: #fff;
            border-radius: 4px;
            border: none;
            &::placeholder {
              color: #aaa;
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
</style>
