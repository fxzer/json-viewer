//计算节点大小
import { GraphOptionsPlus, BsConfig,WhConfig } from "@/types/graph";
import { fittingString } from "./fittingString";
import { getTextWidth } from "./getTextWidth";
export const computeNodeSize = (
  cfg: GraphOptionsPlus,
  base: BsConfig
): WhConfig => {
  const { entries, keyName } = cfg;
  let hasKeyName = !["", undefined, null].includes(keyName);
  const { fontSize, lineHeight, padding, bsheight } = base;
  let width = 40;
  let maxWidth = 400;
  let height = bsheight;
  if (hasKeyName) {
    width = getTextWidth(keyName, fontSize) + padding;
    let knstr =
      width > maxWidth ? fittingString(keyName, maxWidth, fontSize) : keyName;
    let w = Math.min(width, maxWidth + padding);
    return [w, height, knstr];
  }
  let entriesStr = "";
  if (entries) {
    let longestEntry = "";
    let keyNum = Object.keys(entries).length;
    height = padding + keyNum * lineHeight - 10;
    if (keyNum) {
      let entriesArr = Object.entries(entries).map(item => {
        if (typeof item[1] === "string") {
          return `${item[0]}: "${item[1]}"`;
        } else {
          //boolean/number不加引号
          return `${item[0]}: ${item[1]}`;
        }
      });

      entriesStr = entriesArr
        .map(item => fittingString(item, maxWidth, fontSize))
        .join("\n");
      longestEntry = entriesArr.reduce((pre, cur) => {
        //找到最长的字符串
        return pre.length > cur.length ? pre : cur;
      });
    }
    let strw = Math.min(
      getTextWidth(longestEntry, fontSize) + padding,
      maxWidth + padding
    );
    return [strw, height, entriesStr];
  }

  return [width, height, entriesStr];
};
