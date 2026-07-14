/* Final market-build safeguards and dynamic season wording cleanup. */
(() => {
  window.LastLightChoiceGuard?.restore();
  setTimeout(()=>window.LastLightChoiceGuard?.restore(),0);
  const english=window.LastLightLocale?.isEnglish;
  function clean(value){
    let text=String(value??'');
    if(english){
      text=text.replace(/试玩版当前开放：第一章、第二章/g,'Available now: Chapters One and Two');
      text=text.replace(/当前开放：第一章、第二章/g,'Available now: Chapters One and Two');
      text=text.replace(/第二章结局\s*(\d+)\s*\/\s*3\s*·\s*第一季试玩?进度\s*2\s*\/\s*7/g,'Chapter Two Endings $1 / 3 · Season One Progress 2 / 7');
      text=text.replace(/结局收集\s*(\d+)\s*\/\s*5/g,'Endings Collected $1 / 5');
      text=text.replace(/已收集\s*(\d+)\s*\/\s*5/g,'Collected $1 / 5');
      text=text.replace(/第二章：雨水有毒/g,'Chapter Two: Poison Rain');
    }else{
      text=text.replace(/试玩版当前开放/g,'当前开放');
      text=text.replace(/第一季试玩进度/g,'第一季进度');
    }
    return text;
  }
  function process(node){
    if(node.nodeType===Node.TEXT_NODE){const next=clean(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next;return}
    if(node.nodeType!==Node.ELEMENT_NODE&&node.nodeType!==Node.DOCUMENT_NODE)return;
    const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);let current;const list=[];while((current=walker.nextNode()))if(!current.parentElement?.closest('script,style'))list.push(current);list.forEach(process);
  }
  process(document.body);
  const observer=new MutationObserver(records=>records.forEach(record=>record.type==='characterData'?process(record.target):record.addedNodes.forEach(process)));
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
})();
