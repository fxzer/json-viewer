export const LAYOUTS = {
  'mindmap': {
    type: 'mindmap',
    direction: 'LR',
    directions: ['H', 'LR', 'RL', 'TB', 'BT'],
    getWidth: (d) => {
      return d.data?.width
    },
    getHeight: (d) => {
      return d.data?.height
    },
    getVGap: 40,
    getHGap: 120,
  },
  'compact-box': {
    type: 'compact-box',
    direction: 'LR',
    directions: ['LR', 'RL', 'H', 'V'],
    getWidth: (d) => {
      return d.data?.width
    },
    getHeight: (d) => {
      return d.data?.height
    },

    getVGap: 40,
    getHGap: 120,
  },
  'indented': {
    type: 'indented',
    direction: 'LR',
    directions: ['LR', 'RL', 'H'],
    indent: 240,
    dropCap: false,
    getWidth: (d) => {
      return d.data?.width
    },
    getHeight: (d) => {
      return d.data?.height
    },
  },
  'dendrogram': {
    type: 'dendrogram',
    direction: 'LR',
    directions: ['LR', 'RL', 'H'],
    nodeSep: 100,
    rankSep: 160,
    radial: false,
  },

}
