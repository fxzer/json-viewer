<template>
  <div ref="jsonCanvas" class="canvas-area"></div>
</template>

<script lang="ts" setup>
import G6 from "@antv/g6";
import { onMounted, reactive, ref ,watch,defineProps} from "vue";
import { registerFn } from "./registerFn";
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ }),
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
    initGraph(newVal);
  } 
);
//处理数据结构
const dealData = (data, customKeys: Array<string> = []) => {
  let result = {
    id: '',
    children: [
      {
        id: '',
        keyName: '',
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
   if(typeof value === "object" && value !== null) {
      if (Object.keys(value).length) {
        console.log("%c [ Object.keys(value) ]-58", "font-size:14px; background:#5fd44b; color:#a3ff8f;", Object.keys(value));
        let len = result.children.length;
        //生成随机id
        let id  = Math.random().toString(36).substring(2,10);
          result.children[len] =  { ...dealData(value), id,keyName:key}  as any;
        
      }
    } else {
      let level1 = result.children[0];
      if (!level1.id) {
        let id  = Math.random().toString(36).substring(2,10);
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
    dropCap: false,
    indent: 300,
    getHeight: () => {
      return 60;
    },
  },
});
const initGraph = (data) => {
  if (!data) {
    return;
  }
  data = dealData(data, ["result"]);
  console.log("%c [ data ]-117", "font-size:14px; background:#078791; color:#4bcbd5;", data);
  data.id = "root";
  //去除id不存在的元素
  const { config } = propsDefalut;
  const tooltip = new G6.Tooltip({
    offsetX: 20,
    offsetY: 30,
    itemTypes: ["node"],
  });
  registerFn();
  const graph = new G6.TreeGraph({
    container: jsonCanvas.value as HTMLElement,
    width: width.value, // Number，必须，图的宽度
    height: height.value, // Number，必须，图的高度
    ...defaultConfig,
    ...config,
    plugins: [tooltip],
  });
  graph.read(data); // 渲染数据
  graph.zoom(config.defaultZoom || 1);

  const handleCollapse = (e) => {
    const target = e.target;
    const id = target.get("modelId");
    const item = graph.findById(id);
    const nodeModel = item.getModel();
    nodeModel.collapsed = !nodeModel.collapsed;
    graph.layout();
    graph.setItemState(item, "collapse", nodeModel.collapsed as boolean);
  };
  graph.on("collapse-text:click", (e) => {
    handleCollapse(e);
  });
  graph.on("collapse-back:click", (e) => {
    handleCollapse(e);
  });
};
onMounted(() => {
  width.value = jsonCanvas.value?.clientWidth || 1000;
  height.value = jsonCanvas.value?.clientHeight || 800;
  initGraph(porps.modelValue);
});
</script>
<style scoped lang="scss"></style>
