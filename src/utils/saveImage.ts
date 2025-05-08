import type { Graph } from '@antv/g6'

// 保存为图片
export async function saveImage(graph: Graph, name = 'json-viewer', type = 'image/png') {
  if (!graph)
    return

  try {
    const dataURL = await graph.toDataURL({
      mode: 'overall',
      type: type as 'image/png' | 'image/jpeg' | 'image/webp' | 'image/bmp',
      encoderOptions: 1,
    })

    // 将dataURL转换为Blob并下载
    const [head, content] = dataURL.split(',')
    const contentType = head.match(/:(.*?);/)![1]

    const bstr = atob(content)
    let length = bstr.length
    const u8arr = new Uint8Array(length)

    while (length--) {
      u8arr[length] = bstr.charCodeAt(length)
    }

    const blob = new Blob([u8arr], { type: contentType })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.${type.split('/')[1]}`
    a.click()

    // 释放URL对象
    URL.revokeObjectURL(url)
  }
  catch (error) {
    console.error('导出图片失败:', error)
  }
}
