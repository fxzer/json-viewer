export interface FieldState {
  isStorage: ref<boolean>,
  fields: ref<string[]>,
}
type TypeOptionType = 'indented' | 'mindmap' | 'compactBox' | 'dendrogram';

export interface LayoutState {
  activeLayout: ref<string>
  activeConfig: ref<LayoutConfig>
  layoutList: reactive<LayoutList>
}
export interface LayoutList {
  [key: string]: LayoutConfig
}
export interface LayoutConfig {
  type: TypeOptionType;
  direction: string;
  directions: string[];
  indent?: number;
  dropCap?: boolean;
  rankSep?: number;
  nodeSep?: number;
  hgap?: number;
  vgap?: number;
  getHGap?: () => number;
  getVGap?: (d: any) => number;
  [propName: string]: any
}

export interface TypeOption {
  type: TypeOptionType;
  image: string;
}
// export interface ThemeState{
//   themeActive:string,
//   themeList:ThemeItem[]
// }
export interface ThemeItem {
  label: string;
  key: string;
  color: string;
  bgcolor: string;
  hbcolor: string;
  hcolor: string;
  nodeLabelColor?: string;
  nodeHoverColor?: string;
}

// declare interface ImportMeta {
//   VITE_BASE_URL: string
//   VITE_OUTDIR: string
// }
