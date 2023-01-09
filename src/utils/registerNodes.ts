import G6  from "@antv/g6";
import { GraphOptionsPlus } from "@/types/graph";
import { computeNodeSize } from "./computeNodeSize";
import { ThemeItem } from "@/store/types/theme";
const registerNodes = (theme: ThemeItem) => {
  const { color, hcolor, key } = theme;
  let isDark = key === "dark";
  //注册根节点
  G6.registerNode("root-icon", {
    draw(cfg, group) {
      if (!group) return;
      group.addShape("circle", {
        attrs: {
          x: 0,
          y: 0,
          r: 30,
        },
        name: "root-bg-shape",
      });
      //添加图标
      const keyShape = group.addShape("text", {
        attrs: {
          x: 0,
          y: 20,
          fontFamily: "iconfont",
          textAlign: "center",
          text: "\ue867",
          fontSize: 50,
          fill: isDark ? "#68699a" : color,
          // stroke:"#fff",
          cursor: "pointer",
        },
        name: "root-shape",
      });
      //添加label
      group.addShape("text", {
        attrs: {
          x: 0,
          y: -4,
          textAlign: "center",
          textBaseline: "middle",
          text: cfg?.id,
          fontSize: 12,
          fill: "#fff",
          fontWeight: "bold",
        },
        name: "root-label",
      });
      return keyShape;
    },
    // 响应状态变化
    setState(name, value, item) {
      const group = item?.getContainer();
      const shape = group?.get("children")[1]; // 顺序根据 draw 时确定
      if (name === "hover") {
        if (value) {
          if (isDark) {
            shape.attr("fill", "#7b7cbd");
          } else {
            shape.attr("fill", "#F5C146");
          }
        } else {
          if (isDark) {
            shape.attr("fill", "#68699a");
          } else {
            shape.attr("fill", color);
          }
        }
      }
    },
  });
  /**
   * 自定义节点
   */
  G6.registerNode(
    "flow-rect",
    {
      shapeType: "flow-rect",
      draw(cfg: any, group) {
        if (!group) return;
        const {
          collapsed = true,
          entries,
          id,
          keyName,
        } = cfg as GraphOptionsPlus;
        let hasKeyName = !["", undefined, null].includes(keyName);
        //计算矩形节点高度
        let fontSize = 12;
        let padding = fontSize * 2;
        let lineHeight = parseFloat((fontSize * 1.4).toFixed(1));
        let bsheight = lineHeight * 2;
        const [width, height, entriesStr] = computeNodeSize(cfg, {
          fontSize,
          lineHeight,
          padding,
          bsheight,
        });

        const grey = "#CED4D9";
        // 矩形框配置
        const rectConfig = {
          width,
          height,
          lineWidth: 1,
          fontSize,
          fill: isDark ? "#262736" : color + "20",
          radius: 4,
          stroke: color,
          opacity: 1,
        };

        const nodeOrigin = {
          x: -rectConfig.width / 2,
          y: -rectConfig.height / 2,
        };

        const textConfig = {
          textAlign: "left",
          textBaseline: "bottom",
        };

        const rect = group.addShape("rect", {
          attrs: {
            x: nodeOrigin.x,
            y: nodeOrigin.y,
            ...rectConfig,
          },
        });

        // 文本
        group.addShape("text", {
          attrs: {
            ...textConfig,
            x: nodeOrigin.x + 10,
            y: -nodeOrigin.y - 10,
            text: entriesStr,
            fontSize: fontSize,
            lineHeight: lineHeight,
            fill: isDark ? "#D6D7D8" : "#333",
            cursor: "pointer",
          } as any ,
        });

        // collapse rect
        if (cfg.children && cfg.children.length) {
          group.addShape("rect", {
            attrs: {
              x: rectConfig.width / 2 - 6,
              y: -5.6,
              width: 12,
              height: 12,
              stroke: isDark ? "#3D4F66" : "rgba(0, 0, 0, 0.25)",
              cursor: "pointer",
              fill: isDark ? "#222330" : "#fff",
              radius: 2,
            },
            name: "collapse-back",
            modelId: cfg.id,
          });

          // collpase text
          group.addShape("text", {
            attrs: {
              x: rectConfig.width / 2,
              y: -1,
              textAlign: "center",
              textBaseline: "middle",
              text: collapsed ? "+" : "-",
              fontSize: 16,
              cursor: "pointer",
              fill: isDark ? "#aaa" : "rgba(0, 0, 0, 0.25)",
            },
            name: "collapse-text",
            modelId: cfg.id,
          });
        }
        return rect;
      },
      update(cfg, item) {
        const group = item.getContainer();
        this.updateLinkPoints(cfg, group);
      },
      setState(name, value, item) {
        if (name === "collapse") {
          const group = item.getContainer();
          const collapseText = group.find(
            (e) => e.get("name") === "collapse-text"
          );
          if (collapseText) {
            if (!value) {
              collapseText.attr({
                text: "-",
              });
            } else {
              collapseText.attr({
                text: "+",
              });
            }
          }
        } else if (name === "hover") {
          const group = item.getContainer();
          const shape = group.get("children")[0];
          if (isDark) {
            if (value) {
              shape.attr("stroke", "#9AA1DB");
            } else {
              const isFocus = item.hasState("focus");
              if (isFocus) {
                shape.attr("stroke", "#33BB69");
                return;
              }
              shape.attr("stroke", hcolor);
            }
          } else {
            if (value) {
              shape.attr("stroke", "#F4BE50");
              shape.attr("fill", "#FFFCE8");
            } else {
              const isFocus = item.hasState("focus");
              if (isFocus) {
                shape.attr("stroke", "#65B687");
                shape.attr("fill", "#E8FFEA");
                return;
              }
              shape.attr("stroke", hcolor);
              shape.attr("fill", color + "20");
            }
          }
        } else if (name === "focus") {
          if (isDark) {
            const group = item.getContainer();
            const shape = group.get("children")[0];
            if (value) {
              shape.attr("stroke", "#33BB69");
            } else {
              shape.attr("stroke", hcolor);
            }
          } else {
            const group = item.getContainer();
            const shape = group.get("children")[0];
            if (value) {
              shape.attr("stroke", "#65B687");
              shape.attr("fill", "#E8FFEA");
            } else {
              shape.attr("stroke", hcolor);
              shape.attr("fill", color + "20");
            }
          }
        }
      },
      getAnchorPoints(d) {
        return [
          [0, 0.5],
          [1, 0.5],
        ];
      },
    },
    "rect"
  );
};

export default registerNodes;
