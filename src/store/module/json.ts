import { useFieldsStore } from './fields'
import originJson from '@/example.json'
import { deepFormat } from '@/utils/deepFormat'

// json数据仓库
export const useJsonStore = defineStore({
  id: 'json',
  state: () => {
    const { fields } = storeToRefs(useFieldsStore())
    let formatJson
    if (fields.value?.length)
      formatJson = deepFormat(originJson, fields.value)
    else
      formatJson = originJson

    return {
      originJson, // 原始数据
      formatJson, // 格式化后的数据
    }
  },
})
