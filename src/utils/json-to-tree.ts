import { getWidth } from './get-width'
import { cacheIdList, randomId } from './random-id'

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

const LINE_HEIGHT = 20
const PADDING = 10

function nodeWidth(content: string) {
  return getWidth(content) + PADDING * 2
}

// 格式化值，保留字符串的双引号
function formatValue(value: any): string {
  if (typeof value === 'string') {
    return `"${value}"`
  }
  return String(value)
}

// 创建基本节点结构
function createBaseNode(content: string, width?: number, height: number = 40): NodeItem {
  return {
    id: randomId(),
    content,
    style: {
      collapsed: false,
    },
    data: {
      width: width || nodeWidth(content),
      height,
    },
  }
}

// 将对象属性分为基本类型和复杂类型
function categorizeProperties(obj: Record<string, any>): {
  basicProps: [string, any][]
  complexProps: [string, any][]
} {
  const basicProps: [string, any][] = []
  const complexProps: [string, any][] = []

  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || typeof value !== 'object') {
      basicProps.push([key, value])
    }
    else {
      complexProps.push([key, value])
    }
  })

  return { basicProps, complexProps }
}

// 创建包含基本属性的节点
function createBasicPropsNode(basicProps: [string, any][]): NodeItem {
  let maxWidth = 0
  const contentLines = []

  for (const [k, v] of basicProps) {
    const line = `${k}: ${formatValue(v)}`
    contentLines.push(line)
    const lineWidth = getWidth(line)
    maxWidth = Math.max(maxWidth, lineWidth)
  }

  const basicContent = contentLines.join('\n')
  const width = maxWidth + PADDING * 2
  const height = basicProps.length * LINE_HEIGHT + PADDING * 2

  return createBaseNode(basicContent, width, height)
}

// 处理值并创建节点
function createNode(key: string, value: any, formatFields: string[] = []): NodeItem {
  let content = String(key)

  // 处理基本类型
  if (value === null || typeof value !== 'object') {
    content = `${key}: ${formatValue(value)}`
    return createBaseNode(content)
  }

  // 创建节点
  const node = createBaseNode(content)

  // 处理数组
  if (Array.isArray(value)) {
    node.children = value.map((item, index) => createNode(String(index), item, formatFields))
    return node
  }

  // 处理对象
  if (typeof value === 'object' && value !== null) {
    const { basicProps, complexProps } = categorizeProperties(value)

    // 创建子节点
    node.children = []

    // 如果有基础类型属性，创建一个基础属性节点
    if (basicProps.length > 0) {
      node.children.push(createBasicPropsNode(basicProps))
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
  cacheIdList.length = 0

  // 创建根节点
  const rootNode: NodeItem = {
    id: 'ROOT',
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

  // 分类属性
  const { basicProps, complexProps } = categorizeProperties(data)

  // 创建子节点
  rootNode.children = []

  // 如果有基础类型属性，创建一个基础属性节点
  if (basicProps.length > 0) {
    rootNode.children.push(createBasicPropsNode(basicProps))
  }

  // 添加复杂类型节点
  complexProps.forEach(([k, v]) => {
    rootNode.children.push(createNode(k, v, formatFields))
  })

  return rootNode
}
