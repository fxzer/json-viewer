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
        let textFontSize = 12;
        let padding = textFontSize * 2
        let lineHeight = textFontSize * 1.4;
        let height = lineHeight * 2;
        let entriedStr = "";
        if(entries){
          let keyNum =  Object.keys(entries).length;
            height = padding +  keyNum * lineHeight  - 10;
           if(keyNum){
             entriedStr =  Object.entries(entries).map((item,index)=>{
              return `${item[0]}:${item[1]}`
             }).join("\n")
           }
        }
        if(keyNameIsExist && !entriedStr ){
          entriedStr = keyName
        }
        const grey = "#CED4D9";
        // 矩形框配置
        const rectConfig = {
          width: 200,
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
        // 文本
        group.addShape("text", {
          attrs: {
            ...textConfig,
            x: nodeOrigin.x + 10,
            y: -nodeOrigin.y - 10 ,
            text: entriedStr,
            fontSize: textFontSize,
            lineHeight: lineHeight,
            opacity: 0.85,
            fill: "#000",
            cursor: "pointer",
          },
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
  // const rootHtml = (cfg)=> `
  //   <group>
  //      <rect style={{
  //        width: 60, height: 30, fill: '#7E3FEB', stroke: '#fff', radius: 5, 
  //      }} >
  //        <text style={{  
  //          marginLeft: 25,
  //          marginTop: 5,  
  //          textAlign: 'center',
  //          fontSize: 16,
  //          fontWeight: 'bold', 
  //          fill: '#fff' }}> ${cfg.id}</text>
  //      </rect>
  //    </group>
  //    ` 
  //    console.log("%c [ rootHtml ]-184", "font-size:14px; background:#7c84f6; color:#c0c8ff;", rootHtml);
  // G6.registerNode('root-node', 
  // {
  //     //自定义JSX根节点
  //     jsx:rootHtml
  // })

    //注册根节点
    G6.registerNode("root-icon", {
      draw(cfg, group) {
        group.addShape("circle", {
          attrs: {
            x: 0,
            y: 20,
            r: 40,
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
            text: '\ue867',
            fontSize: 50,
            fill: "#7E48F6",
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
            text: cfg.id,
            fontSize: 12,
            fill: "#fff",
          },
          name: "root-label",
        });
        return keyShape;
      },
    });
};
