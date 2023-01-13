//计算字符长度
export const getTextWidth = (longestText:string, fontSize:number, fontWeight = 400) => {
  // 创建临时元素
  const ele = document.createElement("div");
  ele.style.position = "absolute";
  ele.style.whiteSpace = "nowrap";
  ele.style.fontSize = fontSize + "px";
  ele.style.fontWeight = fontWeight+'';
  ele.innerText = longestText;
  document.body.append(ele);
  // 获取span的宽度
  const width = ele.getBoundingClientRect().width;
  // 从body中删除该span
  document.body.removeChild(ele);
  // 返回span宽度
  return Math.ceil(width);
};
// export const getTextWidth = (longestText:string, fontSize:number, fontWeight = 400) => {
//   // 创建临时元素
//   const ele = document.createElement("div");
//   ele.style.position = "absolute";
//   ele.style.whiteSpace = "nowrap";
//   ele.style.fontSize = fontSize + "px";
//   ele.style.fontWeight = fontWeight+'';
//   ele.innerText = longestText;
//   document.body.append(ele);
//   // 获取span的宽度
//   const width = ele.getBoundingClientRect().width;
//   // 从body中删除该span
//   document.body.removeChild(ele);
//   // 返回span宽度
//   return Math.ceil(width);
// };
// function getWidthOfText(txt, fontname='Arial', fontsize=12){
//   if(getWidthOfText.c === undefined){
//       getWidthOfText.c=document.createElement('canvas');
//       getWidthOfText.ctx=getWidthOfText.c.getContext('2d');
//   }
//   getWidthOfText.ctx.font = fontsize + ' ' + fontname;
//   return getWidthOfText.ctx.measureText(txt).width;
// }