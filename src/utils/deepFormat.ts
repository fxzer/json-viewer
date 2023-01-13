
//深度格式化
export const deepFormat = (obj: any,fields:string[]) => {
  if(fields.length === 0) return obj;
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  let result = obj instanceof Array ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let needFormat = fields.includes(key) && typeof obj[key] === "string";
      result[key] =  needFormat ? JSON.parse(obj[key]) : obj[key];
    }
  }
  return result;
}