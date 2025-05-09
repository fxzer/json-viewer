
// 缓存相关变量
const ID_CACHE_SIZE = 50
export const cacheIdList: string[] = []

// 生成随机id (使用缓存减少计算)
export function randomId(): string {
  if (cacheIdList.length > 0) {
    return cacheIdList.pop()
  }
  function makeId(count = 8): string {
    return Math.random().toString(36).substring(2, 2 + count)
  }
  function fillIdList(idList: string[]) {
    for (let i = 0; i < ID_CACHE_SIZE; i++) {
      idList.push(makeId())
    }
  }
  // 批量生成ID并缓存，提高性能
  if (cacheIdList.length === 0) {
    fillIdList(cacheIdList)
  }

  return makeId()
}
