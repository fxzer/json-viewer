import { UseLayoutStore } from './module/layout'
import { UseThemeStore } from './module/theme'
//定义一个全局的store
const useStore = () =>({
  layout: UseLayoutStore(),
  theme: UseThemeStore(),
})
//导出全局的store
export default useStore