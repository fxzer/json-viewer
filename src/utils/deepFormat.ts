// 深度格式化
export function deepFormat(obj: any, fields: string[]) {
  if (fields.length === 0)
    return obj
  if (typeof obj !== 'object' || obj === null)
    return obj

  const result = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const needFormat = fields.includes(key) && typeof obj[key] === 'string'
      result[key] = needFormat ? JSON.parse(obj[key]) : obj[key]
    }
  }
  return result
}
