import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
//引入element-plus自动按需导入插件
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import  removeConsole from 'vite-plugin-remove-console'
import { visualizer } from 'rollup-plugin-visualizer'

const pathSrc = path.resolve(__dirname, "src");
const lifecycle = process.env.npm_lifecycle_event;  //获取npm命令
export default defineConfig(({ command, mode }) => {
    return {
      base: "./",
      plugins: [
        vue(),
        removeConsole(),//移除console
        // visualizer(),//打包分析
        lifecycle === 'report'? visualizer({ open: true, brotliSize: true, filename: 'report.html' }): null,  //打包分析
        AutoImport({
          include: [
            //导入目标文件类型
            /\.[tj]s(x|on)?$/, // .ts, .tsx, .js, .jsx .json
            /\.vue$/,
            /\.vue\?vue/, // .vue
            /\.md$/, // .md
          ],
          imports: [
            // 预定义
            "vue", // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
            "pinia",
            // 自定义
            {
              "@vueuse/core": [
                "useDark",
                "useToggle", // import { useDark } from '@vueuse/core',
              ],
              "@antv/g6": [
                ["default", "G6"], // mport G6  from "@antv/g6";
                // "GraphOptions"  //import { TreeGraph ,GraphOptions}  from "@antv/g6";
              ],
            },
          ],
          dts: true, //方案二:生成自动导入的auto-imports.d.ts声明文件, 解决 '找不到名称“Elxxx”' 报错
          // dts: path.resolve(pathSrc, 'auto-imports.d.ts'), //手动指定文件路径
          resolvers: [ElementPlusResolver()], // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        }),
        Components({
          resolvers: [ElementPlusResolver()],
        }),
      ],
      //指定@为src目录
      resolve: {
        // Vite路径别名配置
        alias: {
          "@": path.resolve(__dirname, "src"),
        },
        extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
      },
      eslintrc: {
        enabled: true, // Default `false`
        filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      //打包配置
    }
  });
