import type { BadgeStyleProps, LabelStyleProps } from '@antv/g6'
import { Text as GText } from '@antv/g'
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
const GREY_COLOR = '#DB9D0D'
const FONT_FAMILY = 'monospace'

class TreeNode extends Rect {
  get data() {
    return this.context.model.getNodeLikeDatum(this.id)
  }

  get childrenData() {
    return this.context.model.getChildrenData(this.id)
  }

  getContentStyle(attributes): false | LabelStyleProps {
    const [width] = this.getSize(attributes)
    const content = this.data.content
    return {
      x: -width / 2 + 8,
      y: 0,
      text: String(content),
      fontSize: 16,
      fontFamily: FONT_FAMILY,
      fill: '#000',
      opacity: 0.85,
      textAlign: 'left',
      textBaseline: 'middle',
    }
  }

  drawContentShape(attributes, container) {
    const contentStyle = this.getContentStyle(attributes)
    this.upsert('content', GText, contentStyle, container)
  }

  getCollapseStyle(attributes): false | BadgeStyleProps {
    if (this.childrenData.length === 0)
      return false
    const { collapsed } = attributes
    const [width] = this.getSize(attributes)
    return {
      backgroundFill: '#000',
      backgroundWidth: 16,
      backgroundHeight: 16,
      backgroundLineWidth: 1,
      backgroundRadius: 4,
      backgroundStroke: GREY_COLOR,
      cursor: 'pointer',
      fill: GREY_COLOR,
      fontSize: 16,
      text: collapsed ? '+' : '-',
      fontFamily: FONT_FAMILY,
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
    const keys = Object.keys(COLORS)
    const randomIndex = Math.floor(Math.random() * keys.length)
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
    this.drawContentShape(attributes, container)
    // this.drawCollapseShape(attributes, container)
  }
}

register(ExtensionCategory.NODE, 'flow-rect', TreeNode)
