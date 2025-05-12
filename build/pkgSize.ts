import { exec } from 'node:child_process'
import path from 'node:path'

// 获取当前脚本绝对路径
const dirname = path.dirname(new URL(import.meta.url).pathname)

export function getPackageSize(folder = 'dist', callback: (size: string) => void) {
  const distPath = path.resolve(dirname, '../', folder)
  const cmdStr = `du -sh ${distPath}`
  exec(cmdStr, (err: any, stdout: any) => {
    if (!err) {
      if (callback && typeof callback === 'function') {
        const size = stdout.split('\t')[0]
        callback(size)
      }
    }
  })
}
