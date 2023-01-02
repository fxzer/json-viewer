<template>
  <div class="json-home">
    <!-- 左侧工具导航栏 -->
    <div class="nav-tools">
      <div class="jv-icon">JV</div>
      <div class="tool-btns">
        <span class="iconfont icon-zhankai-"></span>
        <span class="iconfont icon-bx-edit"></span>
        <span class="iconfont icon-node-layout-1"></span>
        <span class="iconfont icon-zhankai1"></span>
        <span class="iconfont icon-nodeexpand"></span>
        <span class="iconfont icon-import"></span>
        <span class="iconfont icon-export-json"></span>
        <span class="iconfont icon-clear-json"></span>
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
            <span class="iconfont icon-plus"></span>
            <span class="iconfont icon-jianhao"></span>
            <span class="iconfont icon-xueyuan-shousuo"></span>
            <span class="iconfont icon-quanping"></span>
            <span class="iconfont icon-quxiaoquanping"></span>
            <span class="iconfont icon-save"></span>
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
        <JsonCanvas v-model="jsonData"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as V3JsonEditor from 'vue3-json-editor'
import JsonCanvas from '@/views/Home/components/JsonCanvas.vue'
import { ElNotification } from 'element-plus'
import {  ref } from "vue";
const VueJsonEditor = V3JsonEditor.Vue3JsonEditor
// const jsonData = {
//   id: 'g1',
//   name: 'Name1',
//   count: 123456,
//   label: '538.90',
//   currency: 'Yuan',
//   rate: 1.0,
//   status: 'B',
//   variableName: 'V1',
//   variableValue: 0.341,
//   variableUp: false,
//   children: [
//     {
//       id: 'g12',
//       name: 'Deal with LONG label LONG label LONG label LONG label',
//       count: 123456,
//       label: '338.00',
//       rate: 0.627,
//       status: 'R',
//       currency: 'Yuan',
//       variableName: 'V2',
//       variableValue: 0.179,
//       variableUp: true,
//       children: [
//         {
//           id: 'g121',
//           name: 'Name3',
//           collapsed: true,
//           count: 123456,
//           label: '138.00',
//           rate: 0.123,
//           status: 'B',
//           currency: 'Yuan',
//           variableName: 'V2',
//           variableValue: 0.27,
//           variableUp: true,
//           children: [
//             {
//               id: 'g1211',
//               name: 'Name4',
//               count: 123456,
//               label: '138.00',
//               rate: 1.0,
//               status: 'B',
//               currency: 'Yuan',
//               variableName: 'V1',
//               variableValue: 0.164,
//               variableUp: false,
//               children: [],
//             },
//           ],
//         },
//         {
//           id: 'g122',
//           name: 'Name5',
//           collapsed: true,
//           count: 123456,
//           label: '100.00',
//           rate: 0.296,
//           status: 'G',
//           currency: 'Yuan',
//           variableName: 'V1',
//           variableValue: 0.259,
//           variableUp: true,
//           children: [
//             {
//               id: 'g1221',
//               name: 'Name6',
//               count: 123456,
//               label: '40.00',
//               rate: 0.4,
//               status: 'G',
//               currency: 'Yuan',
//               variableName: 'V1',
//               variableValue: 0.135,
//               variableUp: true,
//               children: [
//                 {
//                   id: 'g12211',
//                   name: 'Name6-1',
//                   count: 123456,
//                   label: '40.00',
//                   rate: 1.0,
//                   status: 'R',
//                   currency: 'Yuan',
//                   variableName: 'V1',
//                   variableValue: 0.181,
//                   variableUp: true,
//                   children: [],
//                 },
//               ],
//             },
//             {
//               id: 'g1222',
//               name: 'Name7',
//               count: 123456,
//               label: '60.00',
//               rate: 0.6,
//               status: 'G',
//               currency: 'Yuan',
//               variableName: 'V1',
//               variableValue: 0.239,
//               variableUp: false,
//               children: [],
//             },
//           ],
//         },
//         {
//           id: 'g123',
//           name: 'Name8',
//           collapsed: true,
//           count: 123456,
//           label: '100.00',
//           rate: 0.296,
//           status: 'DI',
//           currency: 'Yuan',
//           variableName: 'V2',
//           variableValue: 0.131,
//           variableUp: false,
//           children: [
//             {
//               id: 'g1231',
//               name: 'Name8-1',
//               count: 123456,
//               label: '100.00',
//               rate: 1.0,
//               status: 'DI',
//               currency: 'Yuan',
//               variableName: 'V2',
//               variableValue: 0.131,
//               variableUp: false,
//               children: [],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: 'g13',
//       name: 'Name9',
//       count: 123456,
//       label: '100.90',
//       rate: 0.187,
//       status: 'B',
//       currency: 'Yuan',
//       variableName: 'V2',
//       variableValue: 0.221,
//       variableUp: true,
//       children: [
//         {
//           id: 'g131',
//           name: 'Name10',
//           count: 123456,
//           label: '33.90',
//           rate: 0.336,
//           status: 'R',
//           currency: 'Yuan',
//           variableName: 'V1',
//           variableValue: 0.12,
//           variableUp: true,
//           children: [],
//         },
//         {
//           id: 'g132',
//           name: 'Name11',
//           count: 123456,
//           label: '67.00',
//           rate: 0.664,
//           status: 'G',
//           currency: 'Yuan',
//           variableName: 'V1',
//           variableValue: 0.241,
//           variableUp: false,
//           children: [],
//         },
//       ],
//     },
//     {
//       id: 'g14',
//       name: 'Name12',
//       count: 123456,
//       label: '100.00',
//       rate: 0.186,
//       status: 'G',
//       currency: 'Yuan',
//       variableName: 'V2',
//       variableValue: 0.531,
//       variableUp: true,
//       children: [],
//     },
//   ],
// };
let jsonData = ref({ "state": "Done", "createdDate": "Jan 2, 2023 6:34:45 PM", "finishedDate": "Jan 2, 2023 6:34:45 PM", "result": "{\"com.syscxp.account.header.account.APIQueryAccountReply\":{\"inventories\":[{\"uuid\":\"7d80d5f47f3141c2a62f23d88e7113a3\",\"name\":\"zhangy\",\"company\":\"tengxun\",\"expiredClean\":false,\"mfa\":false},{\"uuid\":\"927a639b3cb84d68a2822c87cc567c2b\",\"name\":\"lianjunwei\",\"company\":\"犀思云\",\"expiredClean\":false,\"mfa\":false},{\"uuid\":\"2671e995c5c14dfbb967a37837d85196\",\"name\":\"wangjie\",\"company\":\"测试\",\"expiredClean\":false,\"mfa\":false},{\"uuid\":\"2870083d04654bffaea5a68cfa5275ad\",\"name\":\"hst01\",\"company\":\"犀思云\",\"expiredClean\":false,\"mfa\":false},{\"uuid\":\"3461ddfba0d14dfb8ee8dc45fb7cefd8\",\"name\":\"zxhtest\",\"company\":\"辉哥test1\",\"expiredClean\":false,\"mfa\":false}],\"total\":5,\"success\":true}}" }

);
const onJsonChange = (json: any) => {
  jsonData.value =  json 
};
const onJsonError = (err: any) => {
   ElNotification({
    title: '语法错误',
    message: err.message,
    type: 'error',
    duration:6000,
  })
};
</script>
<style scoped lang="scss">
.json-home {
  width: 100%;
  height: 100%;
  display: flex;
  //左侧工具导航栏
  .nav-tools {
    width: 50px;
    height: 100%;
    background-color: #1d2b3a;
    .jv-icon {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: #fff;
      font-size: 20px;
      font-weight: 600;
      //斜体
      font-style: italic;
      //字体阴影
      text-shadow: 0 0px 2px #ddd;
      letter-spacing: 4px;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        bottom: 1px;
        width: 80%;
        height: 1px;
        background-color: rgb(149, 149, 149);
      }
    }
    //  工具按钮
    .tool-btns {
      display: flex;
      flex-direction: column;
      .iconfont {
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #ccc;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
          transform: scale(1.1);
          color: #fff;
        }
      }
    }
  }
  .opt-wrap {
    flex: 1;
    // background-color: pink;
    display: flex;
    .top-title {
      height: 36px;
      line-height: 36px;
      padding: 0 20px;
      background-color: #1d2b3a;
      color: #fff;
    }
    //json编辑区域
    .json-wrap {
      width: 450px;
      display: flex;
      flex-direction: column;
      .edit-area{
         flex:1;
         //样式穿透
         &:deep(#jsoneditor-vue-2.jsoneditor-vue){
          height:100%;
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
        line-height: 36px;
        .opt-btns {
          .iconfont {
            display: inline-block;
            height: 100%;
            padding: 0 4px;
            text-align: center;
            color: #ccc;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.2s;
            &:hover {
              transform: scale(1.1);
              color: #fff;
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
            background-color: #f5f5f5;
            border-radius: 4px;
            border: none;
            //光标样式

            //placeholder样式
            &::placeholder {
              color: #aaa;
            }
          }
          .icon-search {
            position: absolute;
            right: 8px;
            color: #555;
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
      .canvas-area{
        flex:1;
      }
    }
  }
}
</style>
