import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd(),fail=[];
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));
const entries=['index.html','story.html'];

for(const entry of entries){
  if(!exists(entry)){fail.push(`missing ${entry}`);continue}
  const html=read(entry);
  const scripts=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match=>match[1]);
  const styles=[...html.matchAll(/<link[^>]+href="([^"]+)"/g)].map(match=>match[1]);
  if(scripts.length!==1||!scripts[0].startsWith('app-v60.js'))fail.push(`${entry}: expected exactly one v60 script`);
  if(styles.length!==1||!styles[0].startsWith('app-v60.css'))fail.push(`${entry}: expected exactly one v60 stylesheet`);
  if(/story-(?:director|stage|release|i18n|market|ux|v5|p0p1)|sdk\.crazygames/.test(html))fail.push(`${entry}: legacy runtime is still referenced`);
  for(const ref of [...scripts,...styles].map(ref=>ref.split('?')[0]))if(!exists(ref))fail.push(`${entry}: missing ${ref}`);
}

if(exists('index.html')&&exists('story.html')&&read('index.html')!==read('story.html'))fail.push('index.html and story.html differ');
if(!exists('app-v60.js')||!exists('app-v60.css'))fail.push('v60 app files missing');

if(exists('app-v60.js')){
  const source=read('app-v60.js');
  if(source.includes('MutationObserver'))fail.push('v60 controller must not use MutationObserver');
  if(source.includes('suyan-western-transparent'))fail.push('independent Su Yan sprite layer returned');
  if(/\.onclick\s*=/.test(source))fail.push('direct onclick assignment found; use delegated controller actions');
  try{
    const module=await import(`${pathToFileURL(path.join(root,'app-v60.js')).href}?ci=${Date.now()}`);
    const report=module.runSelfTest();
    if(!report.ok)fail.push(...report.errors.map(error=>`state test: ${error}`));
    if(report.scenes<17)fail.push(`scene count ${report.scenes}, expected at least 17`);
    if(report.encounters<12)fail.push(`night encounters ${report.encounters}, expected at least 12`);
    for(const [id,scene] of Object.entries(module.SCENES)){
      if(!exists(scene.asset))fail.push(`${id}: missing scene asset ${scene.asset}`);
      else if(fs.statSync(path.join(root,scene.asset)).size>5_000_000)fail.push(`${id}: scene asset exceeds 5MB`);
    }
  }catch(error){fail.push(`v60 module failed to import: ${error.message}`)}
}

if(fail.length){console.error('\nMARKET SMOKE FAILED\n- '+fail.join('\n- '));process.exit(1)}
console.log('MARKET SMOKE PASSED: single controller, dialogue/reset transitions, integrated scenes and night shift verified.');
