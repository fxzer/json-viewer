import { decompressFromEncodedURIComponent as decode, compressToEncodedURIComponent as encode } from 'lz-string'
import exampleJson from '@/example.json'
import {isObject } from '@/utils'

const params = new URLSearchParams(window.location.search || '')
const baseUrl = import.meta.env.VITE_BASE_URL as string
const url = new URL(baseUrl, window.location.origin)
export const queryKey = 'code'
export const useCodeStore = defineStore('code', () => {
  const exmapleCode = JSON.stringify(exampleJson, null, 2)
  const originCode = ref(decode(params.get(queryKey) || '') || exmapleCode)
  const json = ref(JSON.parse(originCode.value))
  const formatCode = ref<string>(JSON.stringify(json.value, null, 2))

  watch(json, (val) => {
    if (Object.keys(val).length === 0) {
      url.searchParams.delete(queryKey)
      window.history.replaceState('', '', `${url.pathname}`)
      formatCode.value = ''
    }
    else {
      formatCode.value = JSON.stringify(val, null, 2)
      url.searchParams.set(queryKey, encode(formatCode.value))
      window.history.replaceState('', '', `${url.pathname}${url.search}`)
    }
  })


  const jsonValid = ref(true)
  watch(originCode, (codeStr) => {
    if (!codeStr) {
      json.value = {}

      return
    }
    try {
      const mybeObj = JSON.parse(codeStr)
      if (isObject(mybeObj)) {
        json.value = mybeObj
        jsonValid.value = true
      }
      else {
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
  })

  return {
    formatCode,
    originCode,
    json,
    jsonValid,
  }
})
