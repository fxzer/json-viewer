import exampleJson from '@/example.json'
import { decompressFromEncodedURIComponent as decode } from 'lz-string'

const params = new URLSearchParams(window.location.search || '')

export const queryKey = 'code'
export const useCodeStore = defineStore('code', () => {
  const defaultCode = JSON.stringify(exampleJson, null, 2)
  const rawCode = ref(decode(params.get(queryKey) || '') || defaultCode)
  const parsedJson = ref(JSON.parse(rawCode.value))

  const isJsonValid = ref(true)
  watchDebounced(rawCode, (codeString) => {
    if (!codeString) {
      parsedJson.value = {}
      return
    }
    try {
      const parsedObject = JSON.parse(codeString)
      isJsonValid.value = true
      parsedJson.value = parsedObject
    }
    catch (err) {
      isJsonValid.value = false
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
    rawCode,
    parsedJson,
    isJsonValid,
  }
})
