import { defineStore } from "pinia";
import { ThemeConfig } from "./type";
export const UseThemeStore = defineStore({
  id: "theme",
  state: ():ThemeConfig => ({
    themeActive: localStorage.getItem('themeActive') || 'purple',
    themeList: [
      {
        label: "紫白",
        key: "purple",
        color: "#8252F5",
        bgcolor: "#f1f1f1",
        hbcolor: "#fff",
        hcolor: "#7c49f3",
      },
      {
        label: "蓝白",
        key: "blue",
        color: "#5396F6",
        bgcolor: "#f1f1f1",
        hbcolor: "#fff",
        hcolor: "#458df1",
      },
      {
        label: "粉白",
        key: "pink",
        color: "#ff749b",
        bgcolor: "#f1f1f1",
        hbcolor: "#fff",
        hcolor: "#ee6088",
      },
      {
        label: "暗黑",
        key: "dark",
        color: "#5e84b4",
        bgcolor: "#242629",
        hbcolor: "#000",
        hcolor: "#0099FB",
      },
    ],
  }),
  getters: {
    currentTheme(state){
      let theme = state.themeList.find((item:any) => item.key === state.themeActive) || state.themeList[0]
    localStorage.setItem('themeActive',theme.key)
    return theme
    }
  }
});
