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
  //注册根节点
  G6.registerNode("root-icon", {
    draw(cfg, group) {
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
          fill: "#7E48F6",
          cursor:'pointer'
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
          fontWeight: "bold",
        },
        name: "root-label",
      });
      return keyShape;
    },
    // 响应状态变化
    setState(name, value, item) {
      const group = item.getContainer();
      const shape = group.get('children')[1]; // 顺序根据 draw 时确定
      if (name === 'hover') {
        if (value) {
          shape.attr('fill', '#F5C146');
        } else {
          shape.attr('fill', '#7E48F6');
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
      draw(cfg, group) {
        const { collapsed = true, entries, id, keyName } = cfg;
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

        // 文本
        group.addShape("text", {
          attrs: {
            ...textConfig,
            x: nodeOrigin.x + 10,
            y: -nodeOrigin.y - 10,
            text: entriesStr,
            fontSize: fontSize,
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
              x: rectConfig.width / 2 - 6,
              y: -5.6,
              width: 12,
              height: 12,
              stroke: "rgba(0, 0, 0, 0.25)",
              cursor: "pointer",
              fill: "#fff",
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
        }else if(name === 'hover'){
          const group = item.getContainer();
          const shape = group.get('children')[0]; // 顺序根据 draw 时确定
          if (value) {
            shape.attr('stroke', '#F4BE50');
            shape.attr('fill', '#FFFCE8');
          } else {
            // const states = item.getStates();
            const isFocus = item.hasState('focus');
            if(isFocus){
              shape.attr('stroke', '#65B687');
              shape.attr('fill', '#E8FFEA');
              return;
            }
            shape.attr('stroke', '#7D3EE8');
            shape.attr('fill', '#F2EBFD');
          }
        }else if(name === 'focus'){
          const group = item.getContainer();
          const shape = group.get('children')[0];
          if (value) {
            shape.attr('stroke', '#65B687');
            shape.attr('fill', '#E8FFEA');
          } else {
            shape.attr('stroke', '#7D3EE8');
            shape.attr('fill', '#F2EBFD');
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
//节点文本溢出省略
export function fittingString(str, maxWidth, fontSize) {
  const ellipsis = "...";
  const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
  let currentWidth = 0;
  let res = str;
  const pattern = new RegExp("[\u4E00-\u9FA5]+");
  str.split("").forEach((letter, i) => {
    if (currentWidth > maxWidth - ellipsisLength) return;
    if (pattern.test(letter)) {
      currentWidth += fontSize;
    } else {
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth - ellipsisLength) {
      res = `${str.substr(0, i)}${ellipsis}`;
    }
  });
  return res;
}

  //计算字符长度
  export const getTextWidth = (longestText, fontSize, fontWeight = 400) => {
    // 创建临时元素
    const ele = document.createElement("div");
    ele.style.position = "absolute";
    ele.style.whiteSpace = "nowrap";
    ele.style.fontSize = fontSize + "px";
    ele.style.fontWeight = fontWeight;
    ele.innerText = longestText;
    document.body.append(ele);
    // 获取span的宽度
    const width = ele.getBoundingClientRect().width;
    // 从body中删除该span
    document.body.removeChild(ele);
    // 返回span宽度
    return Math.ceil(width);
  };
//计算节点大小
  export const computeNodeSize = (cfg, base) => {
    const { entries, keyName } = cfg;
    let hasKeyName = !["", undefined, null].includes(keyName);
    const { fontSize, lineHeight, padding, bsheight } = base;
    let width = 40;
    let maxWidth = 400;
    let height = bsheight;
    if (hasKeyName) {
      width = getTextWidth(keyName, fontSize) + padding
      let knstr =   width > maxWidth ? fittingString(keyName, maxWidth, fontSize) : keyName;
      let w = Math.min(width,maxWidth + padding)
      return [ w , height, knstr];
    }
    let entriesStr = "";
    if (entries) {
      let longestEntry = "";
      let keyNum = Object.keys(entries).length;
      height = padding + keyNum * lineHeight - 10;
      if (keyNum) {
        let entriesArr = Object.entries(entries).map((item, index) => {
          if (typeof item[1] === "string") {
            return `${item[0]}: "${item[1]}"`;
          } else {
            //boolean/number不加引号
            return `${item[0]}: ${item[1]}`;
          }
        });

        entriesStr =  entriesArr.map((item, index) => fittingString(item, maxWidth, fontSize)).join("\n");
        longestEntry = entriesArr.reduce((pre, cur) => {
          //找到最长的字符串
          return pre.length > cur.length ? pre : cur;
        });
      }
      let strw = Math.min(getTextWidth(longestEntry, fontSize) + padding,maxWidth + padding )
      return [
        strw,
        height,
        entriesStr,
      ];
    }

    return [width, height, entriesStr];
  };