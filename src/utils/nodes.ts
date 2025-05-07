import {
  Badge,
  CommonEvent,
  ExtensionCategory,
  Rect,
  register,
} from '@antv/g6'

const COLORS = {
  B: '#1783FF',
  R: '#F46649',
  Y: '#DB9D0D',
  G: '#60C42D',
  DI: '#A7A7A7',
}
const GREY_COLOR = '#CED4D9'

class TreeNode extends Rect {
  get data() {
    return this.context.model.getNodeLikeDatum(this.id)
  }

  get childrenData() {
    return this.context.model.getChildrenData(this.id)
  }

  getLabelStyle(attributes) {
    const [width, height] = this.getSize(attributes)
    // 获取node的label
    const label = this.data.label
    return {
      x: -width / 2 + 4,
      y: -height / 2 + 12,

      text: label,
      fontSize: 12,
      opacity: 0.85,
      fill: '#000',
      cursor: 'pointer',
    }
  }

  getCollapseStyle(attributes) {
    if (this.childrenData.length === 0)
      return false
    const { collapsed } = attributes
    const [width, height] = this.getSize(attributes)
    return {
      backgroundFill: '#fff',
      backgroundHeight: 16,
      backgroundLineWidth: 1,
      backgroundRadius: 0,
      backgroundStroke: GREY_COLOR,
      backgroundWidth: 16,
      cursor: 'pointer',
      fill: GREY_COLOR,
      fontSize: 16,
      text: collapsed ? '+' : '-',
      textAlign: 'center',
      textBaseline: 'middle',
      x: width / 2,
      y: 0,
    }
  }

  drawCollapseShape(attributes, container) {
    const collapseStyle = this.getCollapseStyle(attributes)
    const btn = this.upsert('collapse', Badge, collapseStyle, container)

    if (btn && !Reflect.has(btn, '__bind__')) {
      Reflect.set(btn, '__bind__', true)
      btn.addEventListener(CommonEvent.CLICK, () => {
        const { collapsed } = this.attributes
        const graph = this.context.graph
        if (collapsed)
          graph.expandElement(this.id)
        else graph.collapseElement(this.id)
      })
    }
  }

  getKeyStyle(attributes) {
    const keyStyle = super.getKeyStyle(attributes)
    // 步骤1: 获取所有键的数组
    const keys = Object.keys(COLORS)
    // 步骤2: 生成随机索引
    const randomIndex = Math.floor(Math.random() * keys.length)
    // 步骤3: 获取随机颜色值
    const stroke = COLORS[keys[randomIndex]]
    return {
      ...keyStyle,
      fill: '#fff',
      lineWidth: 1,
      stroke,
    }
  }

  render(attributes = this.parsedAttributes, container) {
    super.render(attributes, container)

    this.drawCollapseShape(attributes, container)
  }
}

register(ExtensionCategory.NODE, 'flow-rect', TreeNode)
