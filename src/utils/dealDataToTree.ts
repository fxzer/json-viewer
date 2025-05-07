interface NodeItem {
  id: string
  label?: string
  name?: string
  children?: NodeItem[]
  style?: {
    collapsed?: boolean
    [key: string]: any
  }
}

// 缓存相关变量
const ID_CACHE_SIZE = 1000
const idCache: string[] = []

// 生成随机id (使用缓存减少计算)
function generateRandomId(count = 8): string {
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

// 处理值并创建节点
function createNode(key: string, value: any, formatFields: string[] = []): NodeItem {
  const node: NodeItem = {
    id: generateRandomId(),
    label: String(key),
    style: {
      collapsed: false,
    },
  }

  // 处理数组
  if (Array.isArray(value)) {
    node.children = value.map((item, index) => createNode(String(index), item, formatFields))
    return node
  }

  // 处理对象
  if (typeof value === 'object' && value !== null) {
    node.children = Object.entries(value).map(([k, v]) => createNode(k, v, formatFields))
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

  // 处理基本类型
  node.label = `${key}: ${value}`
  return node
}

// 处理数据结构的入口函数
export function dealDataToTree(data: Record<string, any>, formatFields: string[] = []): NodeItem {
  // 重置ID缓存
  idCache.length = 0

  // 创建根节点
  const rootNode: NodeItem = {
    id: generateRandomId(),
    name: 'Root',
    label: 'Root',
    style: {
      collapsed: false,
    },
  }

  if (!data || Object.keys(data).length === 0) {
    return rootNode
  }

  // 处理数据并创建子节点
  rootNode.children = Object.entries(data).map(([key, value]) =>
    createNode(key, value, formatFields),
  )

  return rootNode
}
