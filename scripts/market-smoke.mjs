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
  if(!html.includes('story-v58.js?v=58')||!html.includes('story-v58.css?v=58'))fail.push(`${entry}: v58 presentation not wired`);
  if(html.includes('story-release.js')||html.includes('story-release.css'))fail.push(`${entry}: blocking release loader still wired`);
  if(/sdk\.crazygames\.com/.test(html))fail.push(`${entry}: CrazyGames SDK must stay disabled before platform review`);
  for(const unstable of ['story-p0p1.js','story-p0p1-datafix.js','story-v55.js'])if(html.includes(unstable))fail.push(`${entry}: unstable runtime still enabled: ${unstable}`);
}
if(exists('index.html')&&exists('story.html')&&read('index.html')!==read('story.html'))fail.push('index.html and story.html differ');
for(const f of fs.readdirSync(root).filter(x=>x.endsWith('.js'))){try{execFileSync(process.execPath,['--check',f],{stdio:'pipe'})}catch{fail.push(`${f}: syntax error`)}}
for(const f of ['platform-sdk.js','story-i18n.js','story-liveops.js','story-ux-logic.js','story-v56.js','story-v58.js','story-v58.css'])if(!exists(f))fail.push(`missing core ${f}`);
const v58=exists('story-v58.js')?read('story-v58.js'):'';
if(!v58.includes("classList.remove('integrated-cast')"))fail.push('v58 does not disable integrated cast');
if(!v58.includes('v58-pure-stage'))fail.push('v58 pure stage class missing');
for(const pose of ['fullbody','dialogue-bust','medicine','seated']){const f=`assets/story/characters/suyan-western-transparent/webp/suyan-western-${pose}.webp`;if(!exists(f))fail.push(`missing art ${f}`);else if(fs.statSync(path.join(root,f)).size>2_000_000)fail.push(`${f} exceeds 2MB`)}
if(fail.length){console.error('\nMARKET SMOKE FAILED\n- '+fail.join('\n- '));process.exit(1)}
console.log('MARKET SMOKE PASSED: v58 no-loader entry, pure backgrounds and independent character layer verified.');