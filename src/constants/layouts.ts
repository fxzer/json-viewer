export const LAYOUTS = {
  indented: {
    type: 'indented',
    direction: 'LR',
    directions: ['LR', 'RL', 'TB', 'BT'],
    indent: 240,
    dropCap: false,
    preLayout: true,
  },
  dendrogram: {
    type: 'dendrogram',
    direction: 'LR',
    directions: ['LR', 'RL', 'TB', 'BT'],
    rankSep: 240,
    nodeSep: 240,
    preLayout: true,
  },
  mindmap: {
    type: 'mindmap',
    direction: 'LR',
    directions: ['LR', 'RL', 'H'],
    hgap: 100,
    vgap: 100,
    getHGap: () => {
      return 150
    },
    getVGap: () => {
      return 100
    },
    preLayout: true,
  },
  compactBox: {
    type: 'compactBox',
    direction: 'LR',
    directions: ['LR', 'RL', 'TB', 'BT'],
    hgap: 150,
    vgap: 100,
    getHGap: () => {
      return 150
    },
    getVGap: () => {
      return 100
    },
    preLayout: true,
  },
}
