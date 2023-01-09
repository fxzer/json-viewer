import { defineStore } from "pinia";
import { State } from '../types/fields'
export const useFieldsStore =  defineStore({
  id:'fields',
  state:():State=> {
    let isStorage  = JSON.parse(localStorage.getItem('isStorage')|| 'false' ) 
    let fields =  JSON.parse(localStorage.getItem('extraFields') || '[]')  
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