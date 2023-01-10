<template>
  <div ref="jsonCanvas" class="canvas-area"></div>
</template>

<script lang="ts" setup>
import G6, { TreeGraph } from "@antv/g6";
import { LayoutConfig } from "@/store/types/layout";
import { onMounted, reactive, ref, watch, toRefs } from "vue";
import registerNodes from "@/utils/registerNodes";
import registerBehaviors from "@/utils/registerBehaviors";
import { useLayoutStore, useThemeStore, useFieldsStore } from "@/store";
const { themeActive, currentTheme } = toRefs(useThemeStore());
const { type, config, setType, setConfig } = toRefs(useLayoutStore());
const { isStorage, fields } = toRefs(useFieldsStore());
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  isExpand: {
    type: Boolean,
    default: false,
  },
  isExpandEditor: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["nodeClick"]);

const width = ref(0);
const height = ref(0);
const jsonCanvas = ref<HTMLElement | null>(null);

//监听modelValue变化
watch(
  () => props.modelValue,
  (newVal) => {
    drawGraph(newVal);
  }
);
//监听extraFields变化,重新处理数据画图
watch(
  () => isStorage.value,
  (val) => {
    localStorage.setItem("isStorage", val + "");
  }
);
watch(
  () => fields.value,
  (val) => {
    drawGraph(props.modelValue);
    localStorage.setItem("extraFields", JSON.stringify(val));
  },
  { deep: true }
);

watch(
  () => themeActive.value,
  (val) => {
    if (graph.value) {
      //  刷新
      window.location.reload();
    }
  }
);
//处理数据结构
const dealData = (data, customKeys: Array<string> = []) => {
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
    //转化自定义key
    if (customKeys.includes(key)) {
      value = JSON.parse(data[key]);
    }
    if (typeof value === "object" && value !== null) {
      if (Object.keys(value).length) {
        let len = result.children.length;
        //生成随机id
        let id = Math.random().toString(36).substring(2, 10);
        result.children[len] = { ...dealData(value), id, keyName: key } as any;
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

//转换配置:两种布局特殊处理 把vgap/hgap转化为箭头函数返回形式
const convertLayoutConfig = (config:LayoutConfig) =>{
  const hvgapLayout = ["mindmap", "compactBox"];
    if (hvgapLayout.includes(config.type)) {
      const gap = {
        getVGap: () => {
          return config.vgap;
        },
        getHGap: () => {
          return config.hgap;
        },
      };
      config = { ...config, ...gap };
    }
  return  config
}

//监听到布局配置变化,重新布局
watch(
  () => config.value,
  (val: any) => {
    console.log("%c [ val ]-151", "font-size:14px; background:#dc303a; color:#ff747e;", val);
    if (!graph.value) return;
    const layoutConfig = convertLayoutConfig(val)
    graph.value.updateLayout(layoutConfig);
    localStorage.setItem("layoutType", type.value);
    localStorage.setItem("layoutConfig", JSON.stringify(layoutConfig));
  },
  { deep: true }
);

//获取缓存布局配置
const layoutConfig: LayoutConfig = JSON.parse(
  localStorage.getItem("layoutConfig") || "{}"
);
const layoutType = localStorage.getItem("layoutType");
if (layoutConfig && Object.keys(layoutConfig).length) {
  setConfig.value(layoutConfig);
} else {
  setType.value(layoutType ? layoutType : "mindmap");
}
// 默认配置
let edgeStroke = themeActive.value == "dark" ? "#596f8a" : "#CED4D9";
const defaultConfig = reactive({
  modes: {
    default: ["zoom-canvas", "drag-canvas"],
  },
  fitView: true,
  animate: true,
  defaultNode: {
    type: "flow-rect",
  },
  defaultEdge: {
    type: "cubic-horizontal",
    style: {
      stroke: edgeStroke,
    },
  },
  layout: convertLayoutConfig(config.value)
  
});
const graph = ref<TreeGraph>();
const toolbar = new G6.ToolBar({
  getContent: () => {
    const outDiv = document.createElement("div");
    outDiv.style.display = "none";
    //隐藏outDiv
    return outDiv;
  },
});
const nodeDetail = ref({});
const openNodeDetail = (node) => {
  nodeDetail.value = node.getModel();
  emit("nodeClick", nodeDetail.value);
};
const initGraph = () => {
  const config = {
    padding: [20],
    defaultLevel: 3,
    defaultZoom: 0.8,
    modes: { default: ["zoom-canvas", "drag-canvas"] },
  }
  graph.value = new G6.TreeGraph({
    container: jsonCanvas.value as HTMLElement,
    width: width.value,
    height: height.value,
    ...defaultConfig,
    ...config,
    plugins: [toolbar],
  });
  registerNodes(currentTheme.value); //注册节点
  registerBehaviors(graph.value, openNodeDetail); //注册行为
};
const drawGraph = (data) => {
  if (!data) return;
  data = dealData(data, fields.value);
  //若不缓存,画图后清空
  if (!isStorage.value) localStorage.setItem("extraFields", "");
  //判断是否为空对象
  let isEmpty = Object.keys(data).length === 0;
  const rootConfig = {
    id: isEmpty ? "{ }" : "root",
    type: "root-icon",
  };

  let graphData = Object.assign({}, data, rootConfig);
  graph.value?.read(graphData);
  if (isEmpty) {
    graph.value?.fitView(200);
  } else {
    graph.value?.zoom(0.85);
  }
};
onMounted(() => {
  width.value = jsonCanvas.value?.clientWidth || 860;
  height.value = jsonCanvas.value?.clientHeight || 745;
  initGraph();
  drawGraph(props.modelValue);
});

//监听编辑区展开/收起
watch(
  () => props.isExpandEditor,
  (newVal) => {
    let newWidth = newVal ? width.value : width.value + 450;
    graph.value?.changeSize(newWidth, height.value);
  }
);
//展开/收起
watch(
  () => props.isExpand,
  (newVal) => {
    //获取图数据,修改collapsed属性,重新布局
    let data = graph.value?.save() as any;
    data.collapsed = !newVal;
    graph.value?.layout();
    if (newVal) {
      graph.value?.fitView(20);
    } else {
      graph.value?.moveTo(width.value / 2, height.value / 2);
    }
  }
);
//保存为图片
const saveImage = () => {
  graph.value?.downloadFullImage("json-viewer");
};
//监听窗口大小变化
window.onresize = () => {
  width.value = jsonCanvas.value?.clientWidth || 860;
  height.value = jsonCanvas.value?.clientHeight || 880;
  graph.value?.changeSize(width.value, height.value);
};
//搜索聚焦节点
const focusNode = (keyword: string) => {
  graph.value?.findAll("node", (node) => {
    graph.value?.setItemState(node, "focus", false); // 切换选中
    graph.value?.setItemState(node, "hover", false); // 切换选中
    return false;
  });
  if (!keyword.trim()) {
    graph.value?.fitView(20);
  } else if (keyword === "root") {
    const node = graph.value?.findById("root");
    if (node) {
      graph.value?.setItemState(node, "hover", !node.hasState("hover")); // 切换选中
    }
    graph.value?.focusItem("root", true, {
      easing: "easeCubic",
      duration: 400,
    });
    // 获取所有节点
  } else {
    const findHandle = (node) => {
      //查找规则:entries键值对包含 或 keyName 包含keywork
      let isInclude = false;
      let keyName = node.get("model").keyName || "";
      let entries = node.get("model").entries;
      if (keyName?.includes(keyword)) {
        isInclude = true;
        return isInclude;
      }
      for (let key in entries) {
        let keyStr = key.toString();
        let valStr = entries[key].toString();
        if (keyStr?.includes(keyword) || valStr?.includes(keyword)) {
          isInclude = true;
          break;
        }
      }
      return isInclude;
    };
    const findNodes = graph.value?.findAll("node", findHandle) || [];
    // 动画地移动，并配置动画
    if (findNodes.length > 0) {
      graph.value?.focusItem(findNodes[0], true, {
        easing: "easeCubic",
        duration: 400,
      });
      //清除所有节点的选中状态
      findNodes.forEach((node) => {
        graph.value?.setItemState(node, "focus", true); // 切换选中
      });
    } else {
      graph.value?.fitView(20);
    }
  }
};

defineExpose({
  saveImage,
  toolbar,
  focusNode,
  graph,
});
</script>
<style scoped lang="scss"></style>
