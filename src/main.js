import { createApp } from 'vue'
import './main.scss'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// import '@/assets/iconfont/iconfont.css'
import * as V3JsonEditor from "vue3-json-editor";
const VueJsonEditor = V3JsonEditor.Vue3JsonEditor;

const app = createApp(App)
app.use(ElementPlus,{
  locale: zhCn
})
app.component('VueJsonEditor', VueJsonEditor)
app.mount('#app')
