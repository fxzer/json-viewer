<template>
  <div ref="jsonCanvas" class="canvas-area"></div>
</template>

<script lang="ts" setup>
import { LayoutConfig } from "@/store/types/layout";
import registerNodes from "@/utils/registerNodes";
import registerBehaviors from "@/utils/registerBehaviors";
import { dealDataToTree } from "@/utils/dealDataToTree";
import {
  useLayoutStore,
  useThemeStore,
  useJsonStore,
  useSearchStore,
} from "@/store";

const { themeActive, currentTheme } = toRefs(useThemeStore());
const { formatJson } = toRefs(useJsonStore());
const { type, config, setType, setConfig } = toRefs(useLayoutStore());
const { keyword } = toRefs(useSearchStore());
const props = defineProps({
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

//监听formatJson变化
watch(
  () => formatJson.value,
  (newVal) => {
    drawGraph(newVal);
    //触发聚焦搜索
    setTimeout(() => {
      focusNode(keyword.value);
    }, 500);
  },
  { deep: true }
);

watch(
  () => themeActive.value,
  () => window.location.reload() //  刷新
);

//转换配置:两种布局特殊处理 把vgap/hgap转化为箭头函数返回形式
const convertLayoutConfig = (config: LayoutConfig) => {
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
  return config;
};

//监听到布局配置变化,重新布局
watch(
  () => config.value,
  (val: any) => {
    if (!graph.value) return;
    const layoutConfig = convertLayoutConfig(val);
    //重新布局后居中展示
    graph.value.updateLayout(layoutConfig);
    graph.value.fitView(20);
    localStorage.setItem("layoutType", type.value);
    localStorage.setItem("layoutConfig", JSON.stringify(layoutConfig));
  },
  { deep: true }
);

const nodeDetail = ref({});
const openNodeDetail = (node) => {
  nodeDetail.value = node.getModel();
  emit("nodeClick", nodeDetail.value);
};

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
// 初始化
const graph = ref();
const toolbar = new G6.ToolBar({
  getContent: () => {
    const outDiv = document.createElement("div");
    outDiv.style.display = "none";
    //隐藏outDiv
    return outDiv;
  },
});
const initGraph = () => {
  graph.value = new G6.TreeGraph({
    container: jsonCanvas.value as HTMLElement,
    width: width.value,
    height: height.value,
    fitView: true,
    animate: true,
    defaultNode: {
      type: "flow-rect",
    },
    defaultEdge: {
      type: "cubic-horizontal",
      style:{
        stroke:themeActive.value =='dark' ? "#424660": '#ccc',
      }
    },
    modes: {
      default: [
        { type: "zoom-canvas", enableOptimize: true },
        { type: "drag-canvas",},
      ],
    },
    plugins: [toolbar],
    layout: convertLayoutConfig(config.value),
  });
  registerNodes(currentTheme.value); //注册节点
  registerBehaviors(graph.value, openNodeDetail); //注册行为
};
const drawGraph = (data,isUpdate=true) => {
  if (!data) return;
  data = dealDataToTree(data);
  //判断是否为空对象
  let isEmpty = Object.keys(data).length === 0;
  const rootConfig = {
    id: isEmpty ? "{ }" : "root",
    type: "root-icon",
  };

  let graphData = Object.assign({}, data, rootConfig);

  //优化性能
  if(isUpdate){
    graph.value?.changeData(graphData);
  }else{
    graph.value?.read(graphData);
  }
 
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
  drawGraph(formatJson.value,false);
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
//TODO:大图模糊问题,保存为svg待实现
const saveImage = () => {
  graph.value?.downloadFullImage("json-viewer");
};
//监听窗口大小变化
window.onresize = () => {
  width.value = jsonCanvas.value?.clientWidth || 860;
  height.value = jsonCanvas.value?.clientHeight || 880;
  graph.value?.changeSize(width.value, height.value);
};

//清除节点聚焦状态
const clearState = (graph) => {
  if (!graph) return;
  const selectedNodes = graph.findAllByState("node", "focus");
  selectedNodes.forEach((node) => {
    graph.setItemState(node, "focus", false);
  });
};
//搜索聚焦节点
const focusNode = (keyword: string) => {
  clearState(graph.value);
  const kw = keyword.trim();
  if (!kw) {
    graph.value?.fitView(20);
  } else if ("root".includes(kw)) {
    const node = graph.value?.findById("root");
    if (node) {
      graph.value?.setItemState(node, "focus", !node.hasState("hover")); // 切换选中
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
      if (keyName?.includes(kw)) {
        isInclude = true;
        return isInclude;
      }
      for (let key in entries) {
        let keyStr = key + "";
        let valStr = entries[key] + "";
        if (keyStr?.includes(kw) || valStr?.includes(kw)) {
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
watch(
  () => keyword.value,
  (val) => focusNode(val)
);
defineExpose({
  saveImage,
  toolbar,
  graph,
});
</script>
<style scoped lang="scss"></style>
