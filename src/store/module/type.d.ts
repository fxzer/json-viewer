export interface LayoutConfig{
  type: string;
  direction: string;
  directions: string[];
  indent?: number;
  dropCap?: boolean;
  rankSep?: number;
  nodeSep?: number;
  radial?: boolean;
  autoMode?: boolean;
  hgap?: number;
  vgap?: number;
  getHGap?: () => number;
  getVGap?: (d: any) => number;
  atuoGetVGap?: (d: any) => number;
}