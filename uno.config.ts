import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['flex-col', 'flex flex-col'],
    ['flex-x-center', 'flex justify-center'],
    ['flex-y-center', 'flex items-center'],
    ['flex-center', 'flex justify-center items-center'],
    ['flex-start-center', 'flex justify-start items-center'],
    ['flex-between-center', 'flex justify-between items-center'],
    ['flex-center-stretch', 'flex justify-center items-stretch'],
    ['flex-between-stretch', 'flex justify-between items-stretch'],
    ['flex-around-center', 'flex justify-around items-center'],
    ['flex-start-end', 'flex justify-start items-end'],
    ['flex-end-center', 'flex justify-end items-center'],
    // 宽高相同
    [/^wh-(.+)$/, ([, c]) => `w-${c}  h-${c}`],
  ],
  rules: [
    [
      /^clamp-(\d+)$/,
      ([, d]) => ({
        'display': '-webkit-box',
        '-webkit-box-orient': ' vertical',
        '-webkit-line-clamp': d,
        'overflow': 'hidden',
      }),
    ],
    [
      /^sd-(\d+)-(\d+)$/,
      ([, d, a]) => ({
        'box-shadow': `0 0 ${d}px rgba(0, 0, 0, 0.${a})`,
      }),
    ],
  ],
  theme: {
    colors: {
      ...connectEpTheme(),
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    // 配置以类名使用的 iconify
    presetIcons({
    }), // 以 CSS 方式使用 iconify
  ],
  safelist: [
    // 生成所需的静态类名组合
    ...getSafeEpClass(),
  ], // 防止动态绑定误判为未使用，被 tree-shaking
  transformers: [
    transformerDirectives(), // @apply, @screen, @variants
    transformerVariantGroup(), // 样式分组
  ],
})

function connectEpTheme() {
  const types = ['primary', 'success', 'warning', 'danger', 'error', 'info']
  return types.reduce((prev, type) => {
    prev[`${type}`] = `var(--el-color-${type})`
    for (let i = 1; i <= 2; i++)
      prev[`${type}-dark-${i}`] = `var(--el-color-${type}-dark-${i})`

    for (let j = 1; j <= 9; j++)
      prev[`${type}-light-${j}`] = `var(--el-color-${type}-light-${j})`
    return prev
  }, {})
}

// 获取 Element-plus 安全类名
function getSafeEpClass() {
  return Object.keys(connectEpTheme()).map(key => [
    `bg-${key}`,
    `text-${key}`,
    `border-${key}`,
    `hover:bg-${key}`,
    `hover:text-${key}`,
    `hover:border-${key}`,
  ]).flat()
}
