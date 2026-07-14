/* Isolate Night Shift 2.0 meta from the legacy live-ops closure while preserving one-time migration and story rewards. */
(()=>{'use strict';
const V1='lastLightMetaV1',V2='lastLightMetaV2',B=':backup',g=Storage.prototype.getItem,s=Storage.prototype.setItem;
const fromP1=()=>/story-p0p1\.js(?:\?|:)/.test(String(new Error().stack||''));
Storage.prototype.getItem=function(k){if(this===localStorage&&k===V1&&fromP1())return g.call(this,V2)||g.call(this,V1);return g.call(this,k)};
Storage.prototype.setItem=function(k,v){if(this===localStorage&&k===V1&&fromP1()){const old=g.call(this,V2);if(old)try{JSON.parse(old),s.call(this,V2+B,old)}catch{}return s.call(this,V2,v)}return s.call(this,k,v)};
function read(){try{return JSON.parse(g.call(localStorage,V2)||g.call(localStorage,V1)||'{}')||{}}catch{return{}}}
function write(m){s.call(localStorage,V2,JSON.stringify(m));try{s.call(localStorage,V2+B,JSON.stringify(m))}catch{}}
function reward(id,credits,rep){const m=read();m.claimedStory=m.claimedStory||{};if(m.claimedStory[id])return;m.claimedStory[id]=1;m.credits=(+m.credits||0)+credits;m.reputation=(+m.reputation||0)+rep;write(m);const b=document.querySelectorAll('.p1-menu .liveops-wallet b');if(b[0])b[0].textContent=m.credits;if(b[1])b[1].textContent=m.reputation}
if(typeof renderEndingReport==='function'){const base=renderEndingReport;renderEndingReport=function(){const out=base.apply(this,arguments);reward('chapter1',60,8);return out}}
if(typeof renderChapter2End==='function'){const base=renderChapter2End;renderChapter2End=function(){const out=base.apply(this,arguments);reward('chapter2',90,12);return out}}
window.LastLightRecoveryV2={restore(){const b=g.call(localStorage,V2+B);if(b){s.call(localStorage,V2,b);location.reload();return true}return false}};
})();
