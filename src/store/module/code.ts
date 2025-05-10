import exampleJson from '@/example.json'
import { decompressFromEncodedURIComponent as decode } from 'lz-string'

const params = new URLSearchParams(window.location.search || '')

export const queryKey = 'code'
export const useCodeStore = defineStore('code', () => {
  const exmapleCode = JSON.stringify(exampleJson, null, 2)
  const originCode = ref(decode(params.get(queryKey) || '') || exmapleCode)
  const json = ref(JSON.parse(originCode.value))

  const jsonValid = ref(true)
  watchDebounced(originCode, (codeStr) => {
    if (!codeStr) {
      json.value = {}
      return
    }
    try {
      const mybeObj = JSON.parse(codeStr)
      jsonValid.value = true
      json.value = mybeObj
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
  }, { debounce: 300 })

  return {
    originCode,
    json,
    jsonValid,
  }
})
