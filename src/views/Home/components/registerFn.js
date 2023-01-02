import G6 from "@antv/g6";
// 自定义节点、边
const colors = {
  B: "#5B8FF9",
  R: "#F46649",
  Y: "#EEBC20",
  G: "#5BD8A6",
  DI: "#A7A7A7",
};
export const registerFn = () => {
  /**
   * 自定义节点
   */
  G6.registerNode(
    "flow-rect",
    {
      shapeType: "flow-rect",
      draw(cfg, group) {
        const {  collapsed = true , entries ,id, keyName } = cfg;
        let keyNameIsExist =  keyName !=='' && keyName !== undefined && keyName !== null
        //计算矩形节点高度
        let height = 40;
        let entriedStr = "";
        if(entries){
          let keyNum =  Object.keys(entries).length;
           height =  keyNum <= 2 ? 40 : 40 + (keyNum-2) * 10;
           if(keyNum ){
             entriedStr =  Object.entries(entries).map((item,index)=>{
              return `${item[0]}:${item[1]}`
             }).join("\n")
           }
        }
        if(keyNameIsExist && !entriedStr ){
          entriedStr = keyName
        }
        const grey = "#CED4D9";
        // 逻辑不应该在这里判断
        const rectConfig = {
          width: 202,
          height,
          lineWidth: 1,
          fontSize: 12,
          fill: "#F2EBFD",
          radius: 4,
          stroke: "#7D3EE8",
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

        const rectBBox = rect.getBBox();
        //循环绘制节点
        // if(entries){

        // }
        // label title
        group.addShape("text", {
          attrs: {
            ...textConfig,
            x: 12 + nodeOrigin.x,
            y: 20 + nodeOrigin.y,
            text: entriedStr   ,
            fontSize: 12,
            opacity: 0.85,
            fill: "#000",
            cursor: "pointer",
          },
          name: "name-shape",
        });

        // collapse rect
        if (cfg.children && cfg.children.length) {
          group.addShape("rect", {
            attrs: {
              x: rectConfig.width / 2 - 8,
              y: -8,
              width: 16,
              height: 16,
              stroke: "rgba(0, 0, 0, 0.25)",
              cursor: "pointer",
              fill: "#fff",
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
              fill: "rgba(0, 0, 0, 0.25)",
            },
            name: "collapse-text",
            modelId: cfg.id,
          });
        }

        this.drawLinkPoints(cfg, group);
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
