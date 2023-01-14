//计算节点大小
import { GraphOptionsPlus, WhConfig } from "@/types/graph";
import { fittingString } from "./fittingString";
//将对象每个键值对 格式化为 字符串数组
const formatObj = (obj: any) => {
  return Object.entries(obj).map((entriy) => {
    let key = entriy[0],
      value = entriy[1];
    if (typeof value === "string") return `${key}: "${value}"`;
    //boolean/number不加引号
    return `${key}: ${value}`;
  });
};

//找到最长的字符串
const getLongestStr = (strArr: string[]) => {
  return strArr.reduce((pre, cur) => {
    return pre.length > cur.length ? pre : cur;
  });
};

//获取节点宽度
const getWidth = (text, font = "normal 12px Arial") => {
  //复用canvas提升性能
  let canvas = getWidth.canvas  || (getWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d"); 
  context.font = font;
  let metrics = context.measureText(text);
  return parseFloat(metrics.width.toFixed(2))
};

export const computeNodeSize = (cfg: GraphOptionsPlus): WhConfig => {
  const { entries, keyName } = cfg;
  let hasKeyName = !["", undefined, null].includes(keyName);
  let width = 40, maxWidth = 400, lineHeight = 18;
  let height = lineHeight;
  if (hasKeyName) {
    let keyNameStr = keyName;
    if(getWidth(keyName) < maxWidth){
      width = getWidth(keyName);
    }else{
      width = maxWidth;
      keyNameStr = fittingString(keyName, maxWidth )
    }
    return [width, height, keyNameStr];
  }
  let entriesStr = "", entriesArr = [];
  let keyNum = Object.keys(entries).length;
   height = keyNum * lineHeight;

  if (entries && keyNum) {
    entriesArr =   formatObj(entries) 
    //计算最长字符串像素宽度
    let longestEntry =  getLongestStr(entriesArr);
    let widthest = getWidth(longestEntry);
    if (widthest < maxWidth) {
      width = widthest;
    } else {//超出最大宽度
      width = maxWidth;
      entriesArr.forEach(item => fittingString(item,maxWidth))
    }
    //把对象键值对格式化为字符串
    entriesStr = entriesArr.map(item => fittingString(item, maxWidth )).join("\n");
    return [width, height, entriesStr];
  }

  return [width, height, entriesStr];
};
