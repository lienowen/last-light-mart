import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const root=process.cwd(),fail=[];
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const exists=f=>fs.existsSync(path.join(root,f));
const entries=['index.html','story.html'];
for(const entry of entries){
  if(!exists(entry)){fail.push(`missing ${entry}`);continue}
  const html=read(entry);
  for(const ref of [...html.matchAll(/(?:src|href)="([^"?#]+)(?:\?[^"#]*)?"/g)].map(x=>x[1]).filter(x=>!/^https?:/.test(x))){if(!exists(ref))fail.push(`${entry}: missing ${ref}`)}
  if(!html.includes('story-v55.js?v=55')||!html.includes('story-v55.css?v=55'))fail.push(`${entry}: v55 not wired`);
}
if(exists('index.html')&&exists('story.html')&&read('index.html')!==read('story.html'))fail.push('index.html and story.html differ');
for(const f of fs.readdirSync(root).filter(x=>x.endsWith('.js'))){try{execFileSync(process.execPath,['--check',f],{stdio:'pipe'})}catch{fail.push(`${f}: syntax error`)} }
const p1=read('story-p0p1.js');
const ids=[...p1.matchAll(/^\['([^']+)',[1-4],/gm)].map(x=>x[1]);
if(ids.length!==30)fail.push(`encounters=${ids.length}, expected 30`);
if(new Set(ids).size!==ids.length)fail.push('duplicate encounter ids');
for(const f of ['platform-sdk.js','story-i18n.js','story-liveops.js','story-release.js','story-ux-logic.js','story-p0p1.js','story-p0p1-datafix.js','story-v55.js'])if(!exists(f))fail.push(`missing core ${f}`);
for(const pose of ['fullbody','dialogue-bust','medicine','seated']){const f=`assets/story/characters/suyan-western-transparent/webp/suyan-western-${pose}.webp`;if(!exists(f))fail.push(`missing art ${f}`);else if(fs.statSync(path.join(root,f)).size>2_000_000)fail.push(`${f} exceeds 2MB`)}
if(fail.length){console.error('\nMARKET SMOKE FAILED\n- '+fail.join('\n- '));process.exit(1)}
console.log(`MARKET SMOKE PASSED: ${ids.length} encounters, entries/assets/scripts verified.`);
