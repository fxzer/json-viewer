// import { defineStore } from "pinia";
import { State } from '../types/fields'
export const useFieldsStore =  defineStore({
  id:'fields',
  state:():State=> {
    let isStorage  = ref(JSON.parse(localStorage.getItem('isStorage')|| 'false' ) )
    let fields =  JSON.parse(localStorage.getItem('extraFields') || '[]')  
    //监听改变并持久化
    watch(
      () => isStorage.value,
      (val) => localStorage.setItem("isStorage", val + "")
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