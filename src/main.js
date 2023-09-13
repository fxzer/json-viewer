import { createApp } from 'vue'
import './main.scss'
import * as V3JsonEditor from 'vue3-json-editor'

// 引入pinia
import 'element-plus/theme-chalk/dark/css-vars.css'
import { createPinia } from 'pinia'
import App from './App.vue'

const VueJsonEditor = V3JsonEditor.Vue3JsonEditor
// 创建pinia实例
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.component('VueJsonEditor', VueJsonEditor)
app.mount('#app')
