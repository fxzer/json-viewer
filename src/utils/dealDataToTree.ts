//生成随机id
const generateRandomId = (count = 8):string => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + count);
};
//处理数据结构
export const dealDataToTree = (data, customKeys: Array<string> = []) => {
  let result = {
    id: "",
    children: [
      {
        id: "",
        keyName: "",
        entries: {},
        children: [],
      },
    ],
  };
  for (let key in data) {
    let value = data[key];
    if (typeof value === "object" && value !== null) {
      if (Object.keys(value).length) {
        let len = result.children.length;
        result.children[len] = {
          ...dealDataToTree(value),
          id: generateRandomId(),
          keyName: key,
        } as any;
      }
    } else {
      let level1 = result.children[0];
      if (!level1.id) {
        level1.id = generateRandomId();
      }
      level1.entries[key] = value;
    }
  }
  //去除id不存在的元素
  result.children = result.children.filter((item) => item.id);
  return result;
};
