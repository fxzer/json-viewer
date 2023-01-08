 const registerBehaviors = (graph) =>{
  const handleCollapse = (e) => {
    const target = e.target;
    const id = target.get("modelId");
    const item = graph?.findById(id) ;
    const nodeModel = item.getModel();
    nodeModel.collapsed = !nodeModel.collapsed;
    graph?.layout();
    graph?.setItemState(item, "collapse", nodeModel.collapsed );
  };

  const handleNodeMouseEnter = (e) => {
    const node = e.item;
    graph?.setItemState(node, "hover", !node.hasState("hover")); // 切换选中
  };
  graph.on("collapse-text:click", (e) => {
    e.stopPropagation();
    handleCollapse(e);
  });
  graph.on("collapse-back:click", (e) => {
    e.stopPropagation();
    handleCollapse(e);
  });
  
  graph.on("node:mouseover", (e) => {
    e.stopPropagation();
    handleNodeMouseEnter(e);
  });
  graph.on("node:mouseout", (e) => {
    e.stopPropagation();
    handleNodeMouseEnter(e);
  });
}
export default registerBehaviors;