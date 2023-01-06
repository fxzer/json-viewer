import { defineStore } from "pinia";
import { LayoutConfig } from "./type.d";
export const UseLayoutStore = defineStore({
  id: "layout",
  state: () => ({
    type: "indented",
    config: { } as LayoutConfig,
    layoutList : {
      indented: {
        type: "indented",
        direction: "H", // 'LR' | 'RL'  | 'H'
        directions: ["LR", "RL", "H"],
        indent: 300,
        dropCap: false,
      },
      dendrogram: {
        type: "dendrogram",
        direction: "H", // 'LR' | 'RL'  | 'H'
        directions: ["LR", "RL", "H"],
        rankSep: 500,
        nodeSep: 500,
        radial: true,
      },
      mindmap: {
        type: "mindmap",
        direction: "H",
        directions: ["LR", "RL", "H"],
        autoMode:true,
        hgap: 120,
        vgap: 120,
        getHGap: () => {
          return 120;
        },
        getVGap: () => {
          return 120;
        },
        atuoGetVGap: (d) => {
          let n = Object.keys(d.children).length;
          let m = d.entries ? Object.keys(d.entries).length : 0;
          return 10 * (n + m);
        },
        dropCap: true,
      },
      compactBox: {
        type: "compactBox",
        direction: "V",
        directions: ["LR", "RL", "TB", "BT", "H", "V"],
        radial: true,
        hgap: 120,
        vgap: 120,
        getHGap: () => {
          return 300;
        },
        getVGap: (d) => {
          return 100;
        },
      },
    },
  }),
  actions:{
    setType(type: string){
      this.type = type;
      this.config = this.layoutList[type];
    },
    setConfig(config: LayoutConfig){
      this.type = config.type;
      this.config = config;
    },
  }
});
