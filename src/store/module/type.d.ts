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
}
export interface ThemeItem{
  label: string;
  key: string;
  color: string;
  bgcolor: string;
  hbcolor: string;
  hcolor: string;
}
export interface ThemeConfig{
  themeActive: string;
  themeList:  ThemeItem[];
}