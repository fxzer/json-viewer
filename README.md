<img src="./public/favicon.svg" width="100" height="100" align="center" style="margin:0 auto;" />

# JSON-Viewer（JSON可视化工具）

## 技术栈：Vue 3 + Vite +TS + [Antv/G6](https://g6.antv.vision/) + Pinia +[CodeMirror](codemirror.net)

## 全新版本（2.x.x） 新特性

1. 新增语言（中/英）切换，全站适配
2. 新增 15 种主题色，主题色全站适配
3. 新增亮、暗主题切换功能，编辑器主题跟随切换
4. 新增渲染方式（自动渲染、手动渲染）选择
5. 代码编辑器升级，优化编辑体验，提升性能（VueJsonEditor ---> VueCodeMirror）
6. 完全适配移动端 ，画布节点支持移动端点击、缩放事件，新增缩放比例展示
7. 支持网址链接存储编辑器代码信息，便于分享
8. 布局升级为活动分栏，让布局更灵活易用
9. 新增 PWA 功能，可安装后离线使用

## 优化项

1. JSON 语法报错不渲染，并提示语法错误位置

2. 使用原子化框架 UnoCSS，减小样式文件体积

3. 使用 `oxlint`、`lint-staged`提升语法检查速度

## 主要功能

1. JSON编辑生成对应视图
2. 布局配置调整更新视图
3. 节点收起、展开
4. 导入、导出JSON
5. 指定额外解析字段
6. 亮暗主题切换
7. 15种主题随意切换
8. 视图节点聚焦搜索
9. 视图导出为图片
10. 点击节点查看节点详情
11. 链接分享 JSON 代码
12. 渲染方式控制
13. 画布操作（放大/缩小/居中/全屏/退出全屏）

## 预览地址：

### Bilibili演示：[Bilibili演示视频地址](https://www.bilibili.com/video/BV1cG4y117Rw/?vd_source=0e300a3720f58f257ff36648c263c668)

### Github：[https://fxzer.github.io/json-viewer/](https://fxzer.github.io/json-viewer/)

### Gitee：[https://fxzer.gitee.io/json-viewer](https://fxzer.gitee.io/json-viewer)

## 源码分享

### Github：[https://github.com/fxzer/json-viewer](https://github.com/fxzer/json-viewer)

### Gitee：[https://gitee.com/fxzer/json-viewer](https://gitee.com/fxzer/json-viewer)

## 预览截图

![image.png](./public/screenshot.svg)

## 灵感来源

[JSON Crack](https://github.com/AykutSarac/jsoncrack.com): 一个丝滑且大气的React+TypeScript项目JSON可视化项目。
