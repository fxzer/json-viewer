<p align="center">
<img src="./public/favicon.svg" width="100" height="100" align="center" style="margin:0 auto;" />
</p>

<h1 align="center">JSON-Viewer</h1>

<p align="center">
  <a href="./README.md">中文</a> | English
</p>

<p align="center">
A JSON visualization tool
</p>

## Tech Stack: Vue 3 + Vite + TS + [Antv/G6](https://g6.antv.vision/) + Pinia + [CodeMirror](https://codemirror.net/)

## New Features in Version 2.x.x

1. Added language switching (Chinese/English) with full site adaptation
2. Added 15 theme colors with full site compatibility
3. Added light/dark theme switching with editor theme following
4. Added rendering mode selection (automatic/manual rendering)
5. Upgraded code editor for better editing experience and performance (VueJsonEditor ---> VueCodeMirror)
6. Full mobile adaptation with canvas node support for mobile click and zoom events, added zoom ratio display
7. Support URL storage of editor code information for easy sharing
8. Layout upgraded to active columns for more flexible and user-friendly layout
9. Added PWA functionality for offline use after installation

## Optimizations

1. JSON syntax errors prevent rendering and indicate error location
2. Using atomic framework UnoCSS to reduce style file size
3. Using `@antfu/esling-config` and `lint-staged` to improve syntax checking speed

| Build Resources                 | Before Refactor | After Refactor | Improvement                           |
| :------------------------------ | --------------- | -------------- | ------------------------------------- |
| dist/assets/iconfont-xxxxxx.ttf | 4.68 kB         | None           | 4.68 kB                               |
| dist/assets/index-xxxxxx.css    | 107.92 kB       | 81.94 kB       | 25.98 kB                              |
| dist/assets/index-xxxxxx.js     | 3,325.04 kB     | 2,324.82 kB    | 1,000.22 kB (**Total: -1,030.88 kB**) |

## Main Features

1. JSON editing generates corresponding views
2. Layout configuration adjustment updates view
3. Node collapse and expansion
4. Import and export JSON
5. Specify additional parsing fields
6. Light/dark theme switching
7. 15 themes to choose from
8. View node focus search
9. Export view as image
10. Click node to view node details
11. Share JSON code via link
12. Rendering mode control
13. Canvas operations (zoom in/out/center/fullscreen/exit fullscreen)

## Preview Links:

### Bilibili Demo: [Bilibili Demo Video](https://www.bilibili.com/video/BV18i42117Fa/?spm_id_from=333.999.0.0)

### Github: [https://fxzer.github.io/json-viewer/](https://fxzer.github.io/json-viewer/)

### Gitee: [https://fxzer.gitee.io/json-viewer](https://fxzer.gitee.io/json-viewer)

## Source Code

### Github: [https://github.com/fxzer/json-viewer](https://github.com/fxzer/json-viewer)

### Gitee: [https://gitee.com/fxzer/json-viewer](https://gitee.com/fxzer/json-viewer)

## Preview Screenshots

<img src="./public/preview.svg" width="100%" height="100%" align="center" style="margin:10px auto;" />

## Inspiration

[JSON Crack](https://github.com/AykutSarac/jsoncrack.com): A smooth and elegant React + TypeScript JSON visualization project.
