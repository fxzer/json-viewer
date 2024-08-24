export const LAYOUTS = {
  indented: {
    type: 'indented',
    direction: 'H',
    directions: ['LR', 'RL', 'H'],
    indent: 240,
    dropCap: false,
  },
  dendrogram: {
    type: 'dendrogram',
    direction: 'LR',
    directions: ['LR', 'RL', 'H'],
    rankSep: 240,
    nodeSep: 240,
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
  },
  compactBox: {
    type: 'compactBox',
    direction: 'LR',
    directions: ['LR', 'RL', 'H'],
    hgap: 150,
    vgap: 100,
    getHGap: () => {
      return 150
    },
    getVGap: () => {
      return 100
    },
  },
}
