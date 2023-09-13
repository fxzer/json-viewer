import { defineStore } from 'pinia'
import type { State } from '../types/theme'

export const useThemeStore = defineStore({
  id: 'theme',
  state: (): State => ({
    themeActive: localStorage.getItem('themeActive') || 'purple',
    themeList: [
      {
        label: '紫白',
        key: 'purple',
        color: '#8252F5', // 菜单栏/工具栏前景色
        bgcolor: '#f1f1f1', // 菜单栏背景色
        hcolor: '#7c49f3', // hover前景色
        hbcolor: '#fff', // hover背景色
        nodeLabelColor: '#333333', // 节点内容字体颜色
        nodeHoverColor: '#F4BE50', // 节点内容字体颜色
      },
      {
        label: '蓝白',
        key: 'blue',
        color: '#5396F6',
        hbcolor: '#fff',
        bgcolor: '#f1f1f1',
        hcolor: '#458df1',
        nodeLabelColor: '#333333',
        nodeHoverColor: '#F4BE50',
      },
      {
        label: '粉白',
        key: 'pink',
        color: '#ff749b',
        hbcolor: '#fff',
        bgcolor: '#f1f1f1',
        hcolor: '#ee6088',
        nodeLabelColor: '#333333',
        nodeHoverColor: '#F4BE50',
      },
      {
        label: '暗黑',
        key: 'dark',
        color: '#8076C3',
        bgcolor: '#191A1F',
        hcolor: '#A982F7',
        hbcolor: '#000',
        nodeLabelColor: '#ffffff',
        nodeHoverColor: '#A982F7',
      },

    ],
  }),
  getters: {
    currentTheme(state) {
      const theme = state.themeList.find((item: any) => item.key === state.themeActive) || state.themeList[0]
      localStorage.setItem('themeActive', theme.key)
      return theme
    },
  },
})
