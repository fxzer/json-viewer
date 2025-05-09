import { isObject } from './typeis'

export function exportJSON(json: string | object, name = 'json-viewer.json') {
  const jsonStr = isObject(json)
    ? JSON.stringify(json, undefined, 2)
    : json
  const blob = new Blob([jsonStr as any], { type: 'text/plain' })
  const link = document.createElement('a')
  link.setAttribute('style', 'display: none')
  link.href = URL.createObjectURL(blob)
  link.download = name
  link.click()
}

export function importJSON(callback: (json: any) => void) {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', '.json')
  input.click()
  input.onchange = () => {
    const file = input.files?.[0]
    if (!file)
      return
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      callback(reader.result)
    }
  }
}
