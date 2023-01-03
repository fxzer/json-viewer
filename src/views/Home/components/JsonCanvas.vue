<template>
  <div ref="jsonCanvas" class="canvas-area"></div>
</template>

<script lang="ts" setup>
import G6, { TreeGraph } from "@antv/g6";
import { onMounted, reactive, ref, watch, defineProps } from "vue";
import { registerFn } from "./registerFn";
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  layoutDirection: {
    type: String,
    default: "LR",
  },
  isExpand: {
    type: Boolean,
    default: false,
  },
});
const porps = ref(props).value;
const width = ref(0);
const height = ref(0);
const jsonCanvas = ref<HTMLElement | null>(null);

//  组件props
const propsDefalut = {
  config: {
    padding: [20, 50],
    defaultLevel: 3,
    defaultZoom: 0.8,
    modes: { default: ["zoom-canvas", "drag-canvas"] },
  },
};

//监听modelValue变化
watch(
  () => porps.modelValue,
  (newVal) => {
    // initGraph(newVal);
    drawGraph(newVal);
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
// 默认配置
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
      stroke: "#CED4D9",
    },
  },
  layout: {
    type: "indented",
    direction: "LR",
    dropCap: true,
    indent: 300,
  },
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
const initGraph = () => {
  //去除id不存在的元素
  const { config } = propsDefalut;
  registerFn();

  graph.value = new G6.TreeGraph({
    container: jsonCanvas.value as HTMLElement,
    width: width.value, // Number，必须，图的宽度
    height: height.value, // Number，必须，图的高度
    ...defaultConfig,
    ...config,
    plugins: [toolbar],
  });

  const handleCollapse = (e) => {
    const target = e.target;
    const id = target.get("modelId");
    const item = graph.value?.findById(id) as any;
    const nodeModel = item.getModel();
    nodeModel.collapsed = !nodeModel.collapsed;
    graph.value?.layout();
    graph.value?.setItemState(item, "collapse", nodeModel.collapsed as boolean);
  };
  graph.value.on("collapse-text:click", (e) => {
    handleCollapse(e);
  });
  graph.value.on("collapse-back:click", (e) => {
    handleCollapse(e);
  });
};
const drawGraph = (data) => {
  if (!data) {
    return;
  }
  let isEmpty = Object.keys(data).length === 0;
  data = dealData(data, ["result"]);
  const rootConfig = {
    id: isEmpty ? "{ }" : "root",
    type: "root-icon",
  };

  let graphData = Object.assign({}, data, rootConfig);
  graph.value?.read(graphData);
  //判断是否为空对象
  if (isEmpty) {
    graph.value?.fitView(200);
  } else {
    graph.value?.zoom(0.85);
  }
};
onMounted(() => {
  width.value = jsonCanvas.value?.clientWidth || 1000;
  height.value = jsonCanvas.value?.clientHeight || 800;
  initGraph();
  drawGraph(porps.modelValue);
});

//旋转布局
watch(
  () => porps.layoutDirection,
  (newVal) => {
    if (graph.value) {
      graph.value.changeLayout({
        type: "indented",
        direction: newVal,
        dropCap: true,
        indent: 300,
      });
    }
  }
);
//展开/收起
watch(
  () => porps.isExpand,
  (newVal) => {
    //获取图数据,修改collapsed属性,重新布局
    let data = graph.value?.save() as any;
    data.collapsed = !newVal;
    graph.value?.layout();
  }
);
//保存为图片
const saveImage = () => {
  graph.value?.downloadFullImage("json-viewer");
};
defineExpose({
  saveImage,
  toolbar
});
</script>
<style scoped lang="scss"></style>
