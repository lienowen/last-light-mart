/* Preserve route destinations and effects while the localization layer replaces choice labels. */
(() => {
  if(typeof nodes==='undefined')return;
  const logic={};
  Object.entries(nodes).forEach(([nodeId,node])=>{
    logic[nodeId]=(node.choices||[]).map(choice=>({next:choice[2],effect:choice[3]}));
  });
  function restore(){
    Object.entries(logic).forEach(([nodeId,choices])=>{
      const current=nodes[nodeId]?.choices||[];
      choices.forEach((saved,index)=>{
        if(!current[index])return;
        current[index][2]=saved.next;
        current[index][3]=saved.effect;
      });
    });
  }
  window.LastLightChoiceGuard={restore};
  setTimeout(restore,0);
})();
