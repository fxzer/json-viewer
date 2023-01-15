// import G6  from "@antv/g6";
import { GraphOptionsPlus } from "@/types/graph";
import { computeNodeSize } from "./computeNodeSize";
import { ThemeItem } from "@/store/types/theme";
let focusColor = "#33BB69";

const registerNodes = (theme: ThemeItem) => {
  const { color, hcolor, hbcolor, nodeLabelColor, nodeHoverColor } = theme;
  //不同状态下的颜色映射表
  let rootRolorMap = {
    true: hcolor,
    false: color,
  };
  let rectFocusColorMap = {
    true: {
      stroke: focusColor,
      fill: focusColor + "20",
    },
    //如果hover前是focus状态，hover后颜色恢复聚焦颜色
    false: {
      stroke: color,
      fill: color + "20",
    },
  };
  //注册根节点
  G6.registerNode(
    "root-icon",
    {
      draw(cfg, group) {
        if (!group) return;
        group.addShape("circle", {
          attrs: {
            x: 0,
            y: 0,
            r: 30,
            visible: false, //看不见元素隐藏,提升性能
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
            fill: color, //字体图标颜色
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
            fontSize: 14,
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
        const isFocus = item.hasState("focus");
        if (name === "hover") {
          if(value){
            shape.attr("fill", rootRolorMap[value + ""]);
          }else{
            if(isFocus) {
              shape.attr("fill", focusColor );
              return;
            };
            shape.attr("fill", color);
          }
        }else if(name === "focus"){
          if(value){
            shape.attr("fill", focusColor );
          }else{
            shape.attr("fill", color);
          }
        }
      },
    },
    "circle"
  );
  //自定义矩形文本节点
  G6.registerNode(
    "flow-rect",
    {
      shapeType: "flow-rect",
      draw(cfg: any, group) {
        if (!group) return;
        const { collapsed = true } = cfg as GraphOptionsPlus;
        //计算矩形节点高度
        const [width, height, entriesStr] = computeNodeSize(cfg);
        // 矩形框配置
        const rectConfig = {
          width: width + 20,
          height: height + 20,
          lineWidth: 1,
          fontSize: 12,
          fill: color + "20", //设置透明度
          radius: 4,
          stroke: color,
          opacity: 1,
        };

        const nodeOrigin = {
          x: -rectConfig.width / 2,
          y: -rectConfig.height / 2,
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
            textAlign: "left",
            textBaseline: "bottom",
            x: nodeOrigin.x + 8,
            y: -nodeOrigin.y - 12,
            text: entriesStr,
            fontSize: 12,
            lineHeight: 12 * 1.5,
            fill: nodeLabelColor,
            cursor: "pointer",
            fontFamily: "Arial",
          } as any,
        });

        // 折叠按钮
        let { id, children = [] } = cfg;
        if (children.length) {
          group.addShape("rect", {
            attrs: {
              x: rectConfig.width / 2 - 6,
              y: -6,
              width: 12,
              height: 12,
              stroke: hcolor + "80",
              cursor: "pointer",
              fill: hbcolor,
              radius: 2,
            },
            name: "collapse-back",
            modelId: id,
          });

          // 折叠按钮上的文字
          group.addShape("text", {
            attrs: {
              x: rectConfig.width / 2,
              y: -1,
              textAlign: "center",
              textBaseline: "middle",
              text: collapsed ? "+" : "-",
              fontSize: 16,
              cursor: "pointer",
              fill: hcolor + "80",
            },
            name: "collapse-text",
            modelId: id,
          });
        }
        return rect;
      },
      setState(name, value, item) {
        if (name === "collapse") {
          const group = item.getContainer();
          const collapseText = group.find(
            (e) => e.get("name") === "collapse-text"
          );
          if (collapseText) {
            if (!value) {
              collapseText.attr({ text: "-" });
            } else {
              collapseText.attr({ text: "+" });
            }
          }
        } else if (name === "hover") {
          const group = item.getContainer();
          const shape = group.get("children")[0];
          shape.attr("stroke", "#9AA1DB");
          const isFocus = item.hasState("focus");
          let rectHoverColorMap = {
            true: {
              stroke: nodeHoverColor,
              fill: nodeHoverColor + "20",
            },
            //如果hover前是focus状态，hover后颜色恢复聚焦颜色
            false: {
              stroke: isFocus ? focusColor : color,
              fill: isFocus ? focusColor + "20" : color + "20",
            },
          };
          shape.attr("stroke", rectHoverColorMap[value + ""]["stroke"]);
          shape.attr("fill", rectHoverColorMap[value + ""]["fill"]);
        } else if (name === "focus") {
          const group = item.getContainer();
          const shape = group.get("children")[0];
          shape.attr("stroke", rectFocusColorMap[value + ""]["stroke"]);
          shape.attr("fill", rectFocusColorMap[value + ""]["fill"]);
        }
      },
      getAnchorPoints() {
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
