import { UseLayoutStore } from './module/layout'

//定义一个全局的store
const useStore = () =>({
  layout: UseLayoutStore(),
})
//导出全局的store
export default useStore