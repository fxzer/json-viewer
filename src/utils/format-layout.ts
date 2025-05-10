  /**
   * 格式化布局配置
   */
  export function formatLayoutConfig(layoutConfig: any) {
    const config = { ...layoutConfig }

    if (['mindmap', 'compact-box'].includes(config.type)) {
      const { getVGap, getHGap } = config
      config.getVGap = () => getVGap
      config.getHGap = () => getHGap
    }

    config.animation = false
    return config
  }
