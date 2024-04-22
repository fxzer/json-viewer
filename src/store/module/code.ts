import { decompressFromEncodedURIComponent as decode, compressToEncodedURIComponent as encode } from 'lz-string'
import exampleJson from '@/example.json'
import { isObject, deepFormat } from '@/utils'
import { useGlobalStore } from './global'
const params = new URLSearchParams(window.location.search  || '')
// @ts-ignore
const baseUrl = import.meta.env.VITE_BASE_URL as string
const url = new URL(baseUrl, window.location.origin)
const queryKey = 'code'
export const useCodeStore = defineStore('code', () => {

  const { fields } = storeToRefs(useGlobalStore())
  const exmapleCode = JSON.stringify(exampleJson, null, 2)

  const code = ref<string>(decode(params.get(queryKey) || '') || exmapleCode)
  const json = ref(deepFormat(JSON.parse(code.value), fields.value))

  watch(fields, (val) => {
    json.value = deepFormat(JSON.parse(code.value), val)
  },
  )

  const jsonValid = ref(true)
  watchDebounced(code, (codeStr) => {

    if (!codeStr) {
      json.value = {}
      return
    }
    try {
      const mybeObj = JSON.parse(codeStr)
      if (isObject(mybeObj)) {
        json.value = mybeObj
        jsonValid.value = true
        url.searchParams.set(queryKey, encode(codeStr))
        window.history.replaceState('', '', `${url.pathname}${url.search}`)
      } else {
        jsonValid.value = false
        ElNotification({
          type: 'error',
          title: 'JSON格式错误',
          message: '请输入正确的JSON格式',
          duration: 2000,
        })
      }
    }
    catch (err) {
      jsonValid.value = false
      ElNotification({
        type: 'error',
        title: 'JSON语法错误',
        dangerouslyUseHTMLString: true,
        message: `<pre style="white-space: normal;">${err.message}</pre>`,
        duration: 2000,
      })
    }
  }, { debounce: 500, })

  return {
    code,
    json,
    jsonValid,
  }
})
