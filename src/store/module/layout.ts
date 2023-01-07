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
        indent: 240,
        dropCap: false,
      },
      dendrogram: {
        type: "dendrogram",
        direction: "LR",  
        directions: ["LR", "RL", "H"],
        rankSep: 240,
        nodeSep: 240,
      },
      mindmap: {
        type: "mindmap",
        direction: "LR",
        directions: ["LR", "RL", "H"],
        hgap: 150,
        vgap: 100,
        getHGap: () => {
          return 150;
        },
        getVGap: () => {
          return 100;
        },
      },
      compactBox: {
        type: "compactBox",
        direction: "LR",
        directions: ["LR", "RL",  "H"],
        hgap: 150,
        vgap: 100,
        getHGap: () => {
          return 150;
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
