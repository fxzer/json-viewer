import { COLORS, NODE_COLORS } from '@/constants/theme-colors'
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
    mark?: 'object' | 'array'
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
function createBaseNode(content: string, type: string = 'object', width?: number, height: number = 40): NodeItem {
  const color = NODE_COLORS[type]
  return {
    id: randomId(),
    content,
    style: {
      collapsed: false,
      stroke: color,
      fill: color,
    },
    data: {
      width: width || nodeWidth(content),
      height,
      mark: type as 'object' | 'array',
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
function createBasicPropsNode(basicProps: [string, any][], formatFields: string[]): { basicNode: NodeItem, parsedNodes: NodeItem[] } {
  let maxWidth = 0
  const contentLines = []
  const parsedNodes: NodeItem[] = []

  for (const [k, v] of basicProps) {
    // 处理JSON字符串
    if (typeof v === 'string' && formatFields.includes(k)) {
      try {
        const parsedValue = JSON.parse(v)
        if (typeof parsedValue === 'object' && parsedValue !== null) {
          const parsedNode = createNode(k, parsedValue, formatFields)
          parsedNodes.push(parsedNode)
          continue // 跳过添加到contentLines
        }
      }
      catch {
        console.warn('解析失败，作为普通字符串处理', v)
      }
    }

    const line = `${k}: ${formatValue(v)}`
    contentLines.push(line)
    const lineWidth = getWidth(line)
    maxWidth = Math.max(maxWidth, lineWidth)
  }

  const basicContent = contentLines.join('\n')
  const width = maxWidth + PADDING * 2
  const height = contentLines.length * LINE_HEIGHT + PADDING * 2

  const basicNode = createBaseNode(basicContent, 'other', width, height)

  return { basicNode, parsedNodes }
}

// 处理值并创建节点
function createNode(key: string, value: any, formatFields: string[] = []): NodeItem {
  let content = String(key)
  let type = 'object'

  // 处理基本类型
  if (value === null || typeof value !== 'object') {
    content = `${key}: ${formatValue(value)}`
    type = typeof value
    return createBaseNode(content, type)
  }

  // 处理数组
  if (Array.isArray(value)) {
    const node = createBaseNode(content, 'array')
    node.children = value.map((item, index) => createNode(String(index), item, formatFields))
    return node
  }

  // 处理对象
  if (typeof value === 'object' && value !== null) {
    const node = createBaseNode(content, 'object')
    const { basicProps, complexProps } = categorizeProperties(value)

    // 创建子节点
    node.children = []

    // 如果有基础类型属性，创建一个基础属性节点
    if (basicProps.length > 0) {
      const { basicNode, parsedNodes } = createBasicPropsNode(basicProps, formatFields)

      if (basicNode.content && basicNode.content.trim() !== '') {
        node.children.push(basicNode)
      }

      // 添加解析出的JSON节点
      if (parsedNodes.length > 0) {
        node.children.push(...parsedNodes)
      }
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
      console.warn('解析失败，作为普通字符串处理', value)
    }
  }

  return createBaseNode(content, type)
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
      stroke: COLORS.orange,
      fill: COLORS.orange,
    },
    data: {
      width: 64,
      height: 64,
      mark: 'object',
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
    const { basicNode, parsedNodes } = createBasicPropsNode(basicProps, formatFields)

    if (basicNode.content && basicNode.content.trim() !== '') {
      rootNode.children.push(basicNode)
    }

    // 添加解析出的JSON节点
    if (parsedNodes.length > 0) {
      rootNode.children.push(...parsedNodes)
    }
  }

  // 添加复杂类型节点
  complexProps.forEach(([k, v]) => {
    rootNode.children.push(createNode(k, v, formatFields))
  })

  return rootNode
}
