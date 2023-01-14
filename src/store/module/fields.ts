import { State } from '../types/fields'
export const useFieldsStore =  defineStore({
  id:'fields',
  state:():State=> {
    let isStorage  = ref(JSON.parse(localStorage.getItem('isStorage')|| 'false' ) )
    let fields =  ref(JSON.parse(localStorage.getItem('extraFields') || '[]') ) 
    //监听改变并持久化
    watch(
      () => isStorage.value,
      (val) => {
         localStorage.setItem("isStorage", val + "")
        if(!val){
          localStorage.removeItem('extraFields')
        }else{
          localStorage.setItem('extraFields', JSON.stringify(fields.value))
        }
      }
    );
    return{
        isStorage,
        fields,
    }
  },
  actions:{
    setFields(){
      
    }
  }
})