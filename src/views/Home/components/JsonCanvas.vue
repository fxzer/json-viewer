<template>
  <div ref="jsonCanvas" class="canvas-area"></div>
</template>

<script lang="ts" setup>
import G6, {  TreeGraph } from "@antv/g6";
import { LayoutConfig  } from "@/store/module/type";
import {
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { registerFn } from "./registerFn";
import useStore from "@/store";
import { toRefs } from "vue";
const { layout } = useStore();
const { type,config ,setType,setConfig} = toRefs(layout);
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
  isExpandEditor: {
    type: Boolean,
    default: true,
  },
  extraFields: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["nodeClick"]);

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
  () => props.modelValue,
  (newVal) => {
    // initGraph(newVal);
    drawGraph(newVal);
  }
);
//监听extraFields变化,重新处理数据画图
watch(
  () => props.extraFields,
  (newVal) => {
    drawGraph(props.modelValue);
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
  layout: config ,
});

//监听到布局配置变化,重新布局
watch(() => config.value, (val) => {
  if (graph.value) {
    graph.value.changeLayout(val);
    console.log("%c [ val ]-135", "font-size:14px; background:#b131e7; color:#f575ff;", val);
  }
  localStorage.setItem('layoutType', type.value);
  localStorage.setItem("layoutConfig", JSON.stringify(val));  
},{deep:true});

//获取缓存布局配置
const layoutConfig:LayoutConfig = JSON.parse(localStorage.getItem('layoutConfig'))
const layoutType =  localStorage.getItem('layoutType') 
if( layoutConfig && Object.keys(layoutConfig).length){
 setConfig.value(layoutConfig)
}else{
  setType.value(layoutType ? layoutType : 'indented')
}

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

  const handleNodeClick = (e) => {
    const node = e.item;
    nodeDetail.value = node.getModel();
    emit("nodeClick", nodeDetail.value);
    // 点击时选中，再点击时取消
    // graph.value?.setItemState(node, 'selected', !node.hasState('selected')); // 切换选中
  };
  const handleNodeMouseEnter = (e) => {
    const node = e.item;
    graph.value?.setItemState(node, 'hover', !node.hasState('hover')); // 切换选中
  };
  graph.value.on("collapse-text:click", (e) => {
    e.stopPropagation()
    handleCollapse(e);
  });
  graph.value.on("collapse-back:click", (e) => {
    e.stopPropagation()
    handleCollapse(e);
  });
  graph.value.on("node:click", (e) => {
    handleNodeClick(e);
  });
  graph.value.on("node:mouseover", (e) => {
    e.stopPropagation()
    handleNodeMouseEnter(e);
  });
  graph.value.on("node:mouseout", (e) => {
    e.stopPropagation()
    handleNodeMouseEnter(e);
  });
};
const drawGraph = (data) => {
  if (!data) {
    return;
  }
  let extraKeyStr = localStorage.getItem('extraFields') ;
  if(extraKeyStr){
     data = dealData(data, JSON.parse(extraKeyStr));
  }else{
     data = dealData(data,props.extraFields  as Array<string>);
  }
  let isEmpty = Object.keys(data).length === 0;
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
  width.value = jsonCanvas.value?.clientWidth || 860;
  height.value = jsonCanvas.value?.clientHeight || 745; 
  initGraph();
  drawGraph(props.modelValue);
});

//旋转布局
watch(
  () => props.layoutDirection,
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
//监听编辑区展开/收起
watch(
  () => props.isExpandEditor,
  (newVal) => {
    let newWidth = newVal ? width.value : width.value + 450;
    graph.value?.changeSize(newWidth, height.value);
  }
);
// const exitFullscreen = () =>{
//   nextTick(() =>{
//     width.value = jsonCanvas.value?.clientWidth || 860;
//     height.value = jsonCanvas.value?.clientHeight || 745; 
   
//     graph.value?.changeSize(width.value, height.value);
//   })
// }
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
const focusNode = (keyword) => {
  graph.value?.findAll("node", (node) => {
        graph.value?.setItemState(node, 'focus', false); // 切换选中
        graph.value?.setItemState(node, 'hover', false); // 切换选中
   });
  if (!keyword || keyword === "root") {
    const node = graph.value?.findById("root");
    if(node){
      graph.value?.setItemState(node, 'hover', !node.hasState('hover')); // 切换选中
    } 
    // graph.value?.fitView(20);
    // graph.value?.focusItem("root");
    // 获取所有节点
  } else {
    const findNodes = graph.value?.findAll("node", (node) => {
      //查找规则
      //entries键值对包含 或 keyName 包含
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
    }) || [];
    // 动画地移动，并配置动画
    if (findNodes.length > 0) {
      graph.value?.focusItem(findNodes[0], true, {
        easing: "easeCubic",
        duration: 400,
      });
      //清除所有节点的选中状态
      findNodes.forEach((node) => {
        graph.value?.setItemState(node, 'focus', true); // 切换选中
      });
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
