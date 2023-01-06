import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from 'path';
// import AutoImport from "unplugin-auto-import/vite";
// import Components from "unplugin-vue-components/vite";
// import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
export default defineConfig({
  plugins: [
    vue(),
    // AutoImport({
    //   resolvers: [ElementPlusResolver()],
    // }),
    // Components({
    //   resolvers: [ElementPlusResolver()],
    // }),
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
