export function updateStyle(g) {
  const isDark = useDark()
  const nodes = g.getNodes()
  const state = isDark.value ? 'dark' : 'light'
  nodes.forEach((node) => {
    g.clearItemStates(node, [isDark.value ? 'light' : 'dark', 'hover'])
    g.setItemState(node, state, true)
  })
}
