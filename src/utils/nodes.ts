import type { BadgeStyleProps, LabelStyleProps } from '@antv/g6'
import { NODE_COLORS } from '@/constants/theme-colors'
import { Text as GText } from '@antv/g'
import {
  Badge,
  CommonEvent,
  ExtensionCategory,
  Rect,
  register,
} from '@antv/g6'

class TreeNode extends Rect {
  get data() {
    return this.context.model.getNodeLikeDatum(this.id)
  }

  get childrenData() {
    return this.context.model.getChildrenData(this.id)
  }

  get isDark() {
    return this.context.graph.getTheme() === 'dark'
  }
  get textColor() {
    return this.isDark ? '#fff' : '#000'
  }
  get backgroundColor() {
    return this.isDark ? '#000' : '#fff'
  }

  getContentStyle(attributes): false | LabelStyleProps | any {
    const [width] = this.getSize(attributes)
    const content = this.data.content
    return {
      x: -width / 2 + 8,
      y: 0,
      text: String(content),
      fontSize: 16,
      fill: this.textColor,
      fontFamily: 'monospace',
      opacity: 0.9,
      textAlign: 'left',
      textBaseline: 'middle',
    }
  }

  drawContentShape(attributes, container) {
    const contentStyle = this.getContentStyle(attributes)
    this.upsert('content', GText, contentStyle, container)
  }

  getCollapseStyle(attributes): false | BadgeStyleProps {
    const count = this.childrenData.length
    if (count === 0)
      return false
    const { collapsed } = attributes
    const mark = this.data.data.mark as 'object' | 'array'
    const [width] = this.getSize(attributes)
    const text = collapsed ? (mark === 'object' ? `{${count}}` : `[${count}]`) : '-'

    return {
      backgroundFill: this.backgroundColor,
      backgroundWidth: 16,
      backgroundHeight: 16,
      backgroundLineWidth: 0.5,
      backgroundFillOpacity: 0.5,
      backgroundRadius: 3,
      backgroundStroke: this.textColor,
      backgroundStrokeOpacity: 0.2,
      cursor: 'pointer',
      fill:NODE_COLORS[mark],
      fontSize: collapsed ? 10 : 18,
      text,
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
      btn.addEventListener(CommonEvent.CLICK, (e) => {
        e.stopPropagation()

        const { collapsed } = this.attributes
        const graph = this.context.graph
        if (collapsed)
          graph.expandElement(this.id)
        else graph.collapseElement(this.id)
      })
    }
  }

  // 节点
  getKeyStyle(attributes) {
    const keyStyle = super.getKeyStyle(attributes)
    return {
      ...keyStyle,
    }
  }

  render(attributes = this.parsedAttributes, container) {
    super.render(attributes, container)
    this.drawContentShape(attributes, container)
    this.drawCollapseShape(attributes, container)
  }
}

register(ExtensionCategory.NODE, 'flow-rect', TreeNode)
