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
        //生成随机id
        let id = Math.random().toString(36).substring(2, 10);
        result.children[len] = { ...dealDataToTree(value), id, keyName: key } as any;
      }
    } else {
      let level1 = result.children[0];
      if (!level1.id) {
        let id = Math.random().toString(36).substring(2, 10);
        level1.id = id;
      }
      level1.entries[key] = value;
    }
  }
  //去除id不存在的元素
  result.children = result.children.filter((item) => item.id);
  return result;
};