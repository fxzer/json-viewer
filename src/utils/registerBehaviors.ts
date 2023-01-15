//注册行为
const registerBehaviors = (graph,nodeClickCb:Function) =>{
  const handleCollapse = (e) => {
    e.stopPropagation();
    const target = e.target;
    const id = target.get("modelId");
    const item = graph?.findById(id) ;
    const nodeModel = item.getModel();
    nodeModel.collapsed = !nodeModel.collapsed;
    graph?.layout();
    graph?.setItemState(item, "collapse", nodeModel.collapsed );
  };

  const handleNodeMouseEnter = (e) => {
    e.stopPropagation();
    const node = e.item;
    graph?.setItemState(node, "hover", !node.hasState("hover")); // 切换选中
  };
  const handleNodeClick = (e) => {
    const node = e.item;
    nodeClickCb(node)
  };
  graph.on("collapse-text:click",handleCollapse);
  graph.on("collapse-back:click", handleCollapse);
  
  graph.on("node:mouseover", handleNodeMouseEnter);
  graph.on("node:mouseout", handleNodeMouseEnter);
 
  graph.on("node:click", handleNodeClick);

}
export default registerBehaviors;