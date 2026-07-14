/* Production boot failsafe: never let a blocked SDK or failed asset leave the game behind the loading screen. */
(()=>{'use strict';
const errors=[];
function menuElement(){try{return typeof menu!=='undefined'?menu:document.querySelector('.start-menu,.menu-overlay,[data-start-menu]')}catch{return document.querySelector('.start-menu,.menu-overlay,[data-start-menu]')}}
function closeLoader(reason='failsafe'){
  document.querySelectorAll('.release-loader').forEach(loader=>{
    loader.classList.remove('show');
    loader.style.pointerEvents='none';
    setTimeout(()=>loader.remove(),260);
  });
  document.documentElement.dataset.lastLightBoot=reason;
}
function showFailure(message){
  if(document.getElementById('lastLightBootFailure'))return;
  const box=document.createElement('div');
  box.id='lastLightBootFailure';
  box.style.cssText='position:fixed;z-index:100000;left:50%;bottom:18px;transform:translateX(-50%);width:min(520px,calc(100vw - 24px));padding:12px 14px;background:#111a14f5;border:1px solid #8a6d42;color:#eee7d2;font:12px/1.5 system-ui;box-shadow:0 16px 50px #000d';
  box.innerHTML='<b style="display:block;color:#e4c66d;margin-bottom:4px">Game recovered from a loading error</b><span></span><div style="display:flex;gap:8px;margin-top:9px"><button data-reload style="flex:1;padding:9px;background:#d0b257;border:0;color:#17140d;font-weight:800">Reload</button><button data-reset style="flex:1;padding:9px;background:#273229;border:1px solid #59665b;color:#eee">Reset save</button></div>';
  box.querySelector('span').textContent=String(message||'Unknown startup error').slice(0,180);
  box.querySelector('[data-reload]').onclick=()=>location.reload();
  box.querySelector('[data-reset]').onclick=()=>{localStorage.removeItem('lastLightStory');location.reload()};
  document.body.append(box);
}
addEventListener('error',event=>{const message=event?.message||event?.target?.src||event?.target?.href;if(message)errors.push(String(message));closeLoader('error');},{capture:true});
addEventListener('unhandledrejection',event=>{errors.push(String(event?.reason?.message||event?.reason||'Unhandled promise rejection'));closeLoader('rejection')});
addEventListener('DOMContentLoaded',()=>setTimeout(()=>closeLoader('dom-ready'),800),{once:true});
addEventListener('load',()=>setTimeout(()=>closeLoader('window-load'),150),{once:true});
setTimeout(()=>{
  closeLoader('timeout');
  const activeMenu=menuElement();
  const activeGame=document.querySelector('.route-overlay.show,.chapter-complete.show,.liveops-shell.show,.p1-shell.show');
  if(activeMenu&&!activeGame)activeMenu.classList.add('show');
  if(errors.length)showFailure(errors[0]);
},4200);
window.LastLightBoot={closeLoader,errors,showFailure};
})();