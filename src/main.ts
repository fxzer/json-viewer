import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import { setupI18n } from '@/locales/i18n'
import './main.scss'

// Tailwind 紧凑型样式重置
import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'
import 'splitpanes/dist/splitpanes.css'
// 引入pinia
import 'element-plus/theme-chalk/dark/css-vars.css'

// 创建pinia实例
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
app.use(pinia)
setupI18n(app)
app.mount('#app')
