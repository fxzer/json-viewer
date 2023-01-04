//自定义JSX节点
const rootHtml = (cfg) => {
  //计算矩形节点宽高
  const { collapsed = true, entries, id, keyName } = cfg;
  let [width, height] = computeNodeSize(cfg);
  // const entryJsx = Object.entries(entries).map((item, index) => {
  //   if (typeof item[1] === "string") {
  //     return ` <group><text style={{  
  //       marginLeft: 25,
  //       marginTop: 5,  
  //       textAlign: 'center',
  //       fontSize: 16,
  //       fontWeight: 'bold', 
  //       fill: '#fff' }}> ${cfg.id}</text><group>`
  //   }else{   //boolean/number不加引号
  //     return ` <text style={{
  //       marginLeft: 25,
  //       marginTop: 5,
  //       textAlign: 'center',
  //       fontSize: 16,
  //       fontWeight: 'bold',
  //       fill: '#fff' }}> ${cfg.id}</text>`
  //   }
  // })
  return `
  <group>
     <rect style={{
       width: ${width}, height: ${height}, fill: '#F2EBFD', stroke: '#7D3EE8', radius: 3 
     }} >  
     <group style={{
     }}}>
       <text style={{  
         marginLeft: ${width/2},
         marginTop: 5,  
         textAlign: 'left',
         fontSize: 16,
         fontWeight: 'bold', 
         fill: '#fff' }}> ${cfg.id}</text>
   
       <text style={{  
         marginLeft: ${width/2},
         marginTop: 5,  
         textAlign: 'center',
         fontSize: 16,
         fontWeight: 'bold', 
         fill: 'red' }}> 23434</text>
         <group>
     </rect>
   </group>
    <group style={{
     }}}>
       <text style={{  
         marginLeft: ${width/2},
         marginTop: 5,  
         textAlign: 'left',
         fontSize: 16,
         fontWeight: 'bold', 
         fill: 'green' }}> ${cfg.id}</text>
   
       <text style={{  
         marginLeft: ${width/2},
         marginTop: 5,  
         textAlign: 'center',
         fontSize: 16,
         fontWeight: 'bold', 
         fill: 'green' }}> 23434</text>
         <group>
     </rect>
   </group>
   `;
};
G6.registerNode("dom-node", {
  //自定义JSX根节点
  jsx: rootHtml,
});