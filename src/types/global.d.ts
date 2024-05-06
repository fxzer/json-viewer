export declare global{

  interface ViteEnv {
    VITE_BASE_URL: string
  }

  interface ImportMeta {
    env: ViteEnv
  }

  interface ThemeItem {
    label: string
    key: string
    color: string
    bgcolor: string
    hbcolor: string
    hcolor: string
    nodeLabelColor?: string
    nodeHoverColor?: string
  }

  interface FieldState {
    isStorage: ref<boolean>
    fields: ref<string[]>
  }

  interface LayoutState {
    activeLayout: ref<string>
    activeConfig: ref<LayoutConfig>
    layoutList: reactive<LayoutList>
  }

  interface LayoutList {
    [key: string]: LayoutConfig
  }

  interface LayoutConfig {
    type: TypeOptionType
    direction: string
    directions: string[]
    indent?: number
    dropCap?: boolean
    rankSep?: number
    nodeSep?: number
    hgap?: number
    vgap?: number
    getHGap?: () => number
    getVGap?: (d: any) => number
    [propName: string]: any
  }

type TypeOptionType = 'indented' | 'mindmap' | 'compactBox' | 'dendrogram'
interface TypeOption {
  type: TypeOptionType
  image: string
}
}
