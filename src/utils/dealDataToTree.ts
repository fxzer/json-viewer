import { calcNodeSize } from './calcNodeSize'

interface NodeItem {
  id: string
  content?: string
  name?: string
  children?: NodeItem[]
  style?: {
    collapsed?: boolean
    [key: string]: any
  }
  data: {
    width?: number
    height?: number
  }
}

const getWidth = (() => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const cache = new Map<string, number>()

  return (text: string, font: string = 'normal 20px Arial'): number => {
    const cacheKey = `${font}:${text}`
    if (cache.has(cacheKey))
      return cache.get(cacheKey)!

    context.font = font
    const width = Math.ceil(context.measureText(text).width)
    cache.set(cacheKey, width)
    return width
  }
})()
// 缓存相关变量
const ID_CACHE_SIZE = 1000
const idCache: string[] = []

// 生成随机id (使用缓存减少计算)
function randomId(count = 8): string {
  if (idCache.length > 0) {
    return idCache.pop()
  }

  // 批量生成ID并缓存，提高性能
  if (idCache.length === 0) {
    for (let i = 0; i < ID_CACHE_SIZE; i++) {
      idCache.push(Math.random().toString(36).substring(2, 2 + count))
    }
    return idCache.pop()
  }

  return Math.random().toString(36).substring(2, 2 + count)
}

// 格式化值，保留字符串的双引号
function formatValue(value: any): string {
  if (typeof value === 'string') {
    return `"${value}"`
  }
  return String(value)
}
const lineHeight = 18
const padding = 10

// 处理值并创建节点
function createNode(key: string, value: any, formatFields: string[] = []): NodeItem {
  let content = String(key)

  // 处理基本类型
  if (value === null || typeof value !== 'object') {
    content = `${key}: ${formatValue(value)}`
  }
  const width = getWidth(content)

  const node: NodeItem = {
    id: randomId(),
    content,
    style: {
      collapsed: false,
    },
    data: {
      width,
      height:40,
    },
  }

  // 处理数组
  if (Array.isArray(value)) {
    node.children = value.map((item, index) => createNode(String(index), item, formatFields))
    return node
  }

  // 处理对象
  if (typeof value === 'object' && value !== null) {
    // 收集基础类型和对象/数组类型
    const basicProps: [string, any][] = []
    const complexProps: [string, any][] = []

    Object.entries(value).forEach(([k, v]) => {
      if (v === null || typeof v !== 'object') {
        basicProps.push([k, v])
      }
      else {
        complexProps.push([k, v])
      }
    })

    // 创建子节点
    node.children = []

    // 如果有基础类型属性，创建一个基础属性节点
    if (basicProps.length > 0) {
      const basicContent = basicProps
        .map(([k, v]) => `${k}: ${formatValue(v)}`)
        .join('\n')

      /* 算出 basicContent 最大内容的宽度 */
      const width = Math.max(...basicContent.split('\n').map(line => getWidth(line))) + padding * 2
      const height = basicProps.length * lineHeight + padding * 2; // Altura total del nodo

      const basicNode: NodeItem = {
        id: randomId(),
        content: basicContent,
        style: {
          collapsed: false,
        },
        data: {
          width,
          height,
        },
      }
      node.children.push(basicNode)
    }

    // 添加复杂类型节点
    complexProps.forEach(([k, v]) => {
      node.children.push(createNode(k, v, formatFields))
    })

    return node
  }

  // 处理JSON字符串
  if (typeof value === 'string' && formatFields.includes(key)) {
    try {
      const parsedValue = JSON.parse(value)
      if (typeof parsedValue === 'object' && parsedValue !== null) {
        const parsedNode = createNode(key, parsedValue, formatFields)
        return parsedNode
      }
    }
    catch {
      // 解析失败，作为普通字符串处理
    }
  }

  return node
}

// 处理数据结构的入口函数
export function jsonToTree(data: Record<string, any>, formatFields: string[] = []): NodeItem {
  // 重置ID缓存
  idCache.length = 0


  // 创建根节点
  const rootNode: NodeItem = {
    id: randomId(),
    name: 'ROOT',
    content: 'ROOT',
    style: {
      collapsed: false,
    },
    data: {
      width: 64,
      height: 64,
    },
  }

  if (!data || Object.keys(data).length === 0) {
    return rootNode
  }

  // 收集基础类型和对象/数组类型
  const basicProps: [string, any][] = []
  const complexProps: [string, any][] = []

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || typeof value !== 'object') {
      basicProps.push([key, value])
    }
    else {
      complexProps.push([key, value])
    }
  })

  // 创建子节点
  rootNode.children = []

  // 如果有基础类型属性，创建一个基础属性节点
  if (basicProps.length > 0) {
    const basicContent = basicProps
      .map(([k, v]) => `${k}: ${formatValue(v)}`)
      .join('\n')
    const height = basicProps.length * lineHeight + padding * 2; // Altura total del nodo
    const width = Math.max(...basicContent.split('\n').map(line => getWidth(line))) + padding * 2

    const basicNode: NodeItem = {
      id: randomId(),
      content: basicContent,
      style: {
        collapsed: false,
      },
      data: {
        width,
        height,
      },
    }
    rootNode.children.push(basicNode)
  }

  // 添加复杂类型节点
  complexProps.forEach(([k, v]) => {
    rootNode.children.push(createNode(k, v, formatFields))
  })

  // 使用console.warn替代console.log
  console.warn('[ rootNode ]', rootNode)
  return rootNode
}
