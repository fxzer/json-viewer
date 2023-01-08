import path from 'path';
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
//引入element-plus自动按需导入插件
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      dts: "src/auto-imports.d.ts", //方案二:解决 '找不到名称“Elxxx”' 报错  
      resolvers: [ElementPlusResolver()],
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
});
