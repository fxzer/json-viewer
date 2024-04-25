import path from 'node:path'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
// 引入element-plus自动按需导入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'
import { webUpdateNotice } from '@plugin-web-update-notification/vite'
import { version } from './package.json'
// const pathSrc = path.resolve(__dirname, 'src')
const lifecycle = process.env.npm_lifecycle_event
// 获取npm命令
export default defineConfig(({ _, mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_BASE_URL,
    plugins: [
      vue(),
      UnoCSS(),
      // visualizer(),//打包分析
      lifecycle === 'report'
        ? visualizer({ open: true, brotliSize: true, filename: 'report.html' })
        : null, // 打包分析
      AutoImport({
        // dirs: ['src/hooks'],
        include: [
          // 导入目标文件类型
          /\.[tj]s(x|on)?$/, // .ts, .tsx, .js, .jsx .json
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        imports: [
          // 预定义
          'vue', // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
          'pinia',
          '@vueuse/core',
          {
            '@antv/g6': [
              ['default', 'G6'], // import G6  from "@antv/g6";
            ],
          },
        ],
        dts: 'src/types/auto-imports.d.ts', // 方案二:生成自动导入的auto-imports.d.ts声明文件, 解决 '找不到名称“Elxxx”' 报错
        resolvers: [ElementPlusResolver()], // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/types/auto-components.d.ts',
      }),
      VitePWA({
        outDir: 'dist',
        manifest: {
          lang: 'zh-CN',
          name: 'json-viewer',
          short_name: 'json-viewer',
          scope: '/json-viewer/',
          start_url: '/json-viewer/',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          icons: [
            {
              src: '/json-viewer/logo_512.png',
              types: 'img/png',
              sizes: '512x512',
              purpose: 'any',
            },
            {
              src: '/json-viewer/logo_192.png',
              types: 'img/png',
              sizes: '192x192',
              purpose: 'maskable',
            },
            {
              src: '/json-viewer/logo_144.png',
              types: 'img/png',
              sizes: '144x144',
              purpose: 'any',
            },
            {
              src: '/json-viewer/logo_120.png',
              types: 'img/png',
              sizes: '120x120',
              purpose: 'any',
            },
            {
              src: '/json-viewer/logo_72.png',
              types: 'img/png',
              sizes: '72x72',
              purpose: 'maskable',
            },
          ],
        },
      }),
      webUpdateNotice({
        hiddenDismissButton: true,
        checkInterval: 1 * 60 * 1000,
        notificationProps: {
          title: '🎉 网站更新提示!',
          description: `检测到新版本(${version}), 请刷新页面后使用！`,
          buttonText: '刷新',
        },
      }),
    ],
    // 指定@为src目录
    resolve: {
      // Vite路径别名配置
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    eslintrc: {
      enabled: true, // Default `false`
      filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
      globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
    },
    esbuild: {
      pure: ['console', 'debugger'],
    },
    server: {
      host: true,
      open: true,
    },
    // 打包配置
    build: {
      outDir: env.VITE_OUTDIR,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // if (id.includes("node_modules")) {
            //   return "vendor";
            // }
            if (id.includes('node_modules')) {
              if (id.includes('@codemirror'))
                return 'codemirror'
              else if (id.includes('@antv'))
                return 'antv'
              else
                return 'vendor'
            }
          },
        },
      },
    },
  }
})
