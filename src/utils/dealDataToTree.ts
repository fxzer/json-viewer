
interface NodeItem {
  id: string
  keyName?: string
  entries?: Record<string, any>
  children?: NodeItem[]
}

// 生成随机id
function generateRandomId(count = 8): string {
  return Math.random().toString(36).substring(2, 2 + count)
}

// 创建或获取普通节点
function getOrCreateNormalNode(parent: NodeItem): NodeItem {
  let normalNode = parent.children.find(child => !child.keyName)
  if (!normalNode) {
    normalNode = {
      id: generateRandomId(),
      entries: {},
      children: [],
    }
    parent.children.push(normalNode)
  }
  return normalNode
}
function handleValue(key, value, parent, formatFields) {
  if (typeof value === 'object' && value !== null) {
    handleObjectNode(key, value, parent, formatFields)
  }
  else {
    handlePrimitiveValue(key, value, parent, formatFields)
  }
}
// 处理并递归子节点
function handleObjectNode(key: string, value: any, parent: NodeItem, formatFields: string[]): void {
  const child: NodeItem = {
    id: generateRandomId(),
    keyName: key,
    children: [],
  }
  parent.children.push(child)
  processNode(value, child, formatFields)
}

// 处理普通值
function handlePrimitiveValue(key: string, value: any, parent: NodeItem, formatFields: string[]): void {
  // 如果是 JSON 字符串并且在 formatFields 中，尝试解析
  if (typeof value === 'string' && formatFields.includes(key)) {
    try {
      const parsedValue = JSON.parse(value)
      // 如果解析成功且是对象，递归处理
      handleValue(key, parsedValue, parent, formatFields)
    }
    catch {
      getOrCreateNormalNode(parent).entries[key] = value
    }
  }
  else {
    getOrCreateNormalNode(parent).entries[key] = value
  }
}

// 递归处理数据结构
function processNode(node: Record<string, any>, parent: NodeItem, formatFields: string[]): void {
  for (const key in node) {
    handleValue(key, node[key], parent, formatFields)
  }
}

// 处理数据结构的入口函数
export function dealDataToTree(data: Record<string, any>, formatFields: string[] = []): NodeItem {
  const result: NodeItem = {
    id: generateRandomId(),
    children: [],
  }
  processNode(data, result, formatFields)
  return result
}
