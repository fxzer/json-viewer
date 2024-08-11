import type { Plugin } from 'vite'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import pc from 'picocolors'
import { getPackageSize } from './pkgSize'

dayjs.extend(duration)

export function setupPrintBuildInfo(): Plugin {
  let config: { command: string }
  let startTime: Dayjs
  let endTime: Dayjs
  let outDir: string
  return {
    name: 'vite:PrintBuildInfo',
    configResolved(resolvedConfig) {
      config = resolvedConfig
      outDir = resolvedConfig.build?.outDir ?? 'dist'
    },
    buildStart() {
      if (config.command === 'build')
        startTime = dayjs(new Date())
    },
    closeBundle() {
      if (config.command !== 'build')
        return
      endTime = dayjs(new Date())
      const timeString = dayjs.duration(endTime.diff(startTime)).format('mm分ss秒')
      getPackageSize(outDir, (size: string) => {
        // eslint-disable-next-line no-console
        console.log(pc.bold(pc.green(`🎉恭喜打包完成（总用时${timeString}，总体积${size}）`)),
        )
      })
    },
  }
}
