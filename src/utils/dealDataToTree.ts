// 生成随机id
function generateRandomId(count = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + count)
}
// 处理数据结构
export function dealDataToTree(data) {
  const result = {
    id: '',
    children: [
      {
        id: '',
        keyName: '',
        entries: {},
        children: [],
      },
    ],
  }
  for (const key in data) {
    const value = data[key]
    if (typeof value === 'object' && value !== null) {
      if (Object.keys(value).length) {
        const len = result.children.length
        result.children[len] = {
          ...dealDataToTree(value),
          id: generateRandomId(),
          keyName: key,
        } as any
      }
    }
    else {
      const level1 = result.children[0]
      if (!level1.id)
        level1.id = generateRandomId()

      level1.entries[key] = value
    }
  }
  // 去除id不存在的元素
  result.children = result.children.filter(item => item.id)
  return result
}
