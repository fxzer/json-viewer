export interface State{
  type:string,
  config:LayoutConfig,
  layoutList: LayoutList
}
export interface LayoutList{
  [key:string]:LayoutConfig
}
export interface LayoutConfig{
  type: string;
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
  atuoGetVGap?: (d: any) => number;
  [propName:string]:any
}