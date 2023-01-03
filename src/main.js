import { createApp } from 'vue'
import './main.scss'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import '@/assets/iconfont/iconfont.css'
const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
