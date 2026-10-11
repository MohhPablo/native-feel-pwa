// Reproducible seeded regression: only a temporary copy is changed.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'pwa-demo-'));
try {
 const target=path.join(temp,'reader');
 fs.cpSync(path.join(root,'examples/react-vite'),target,{recursive:true,filter:s=>!['dist','node_modules'].includes(path.basename(s))});
 const html=path.join(target,'index.html'),css=path.join(target,'src/styles.css');
 const originalHtml=fs.readFileSync(html,'utf8'),originalCss=fs.readFileSync(css,'utf8');
 fs.writeFileSync(html,originalHtml.replace('initial-scale=1','initial-scale=1, user-scalable=no'));
 fs.writeFileSync(css,originalCss+'\nhtml { user-select:none; touch-action:none; }\n');
 const run=()=>{const result=spawnSync(process.execPath,[path.join(root,'scripts/pwa-audit.mjs'),target,'--strict'],{encoding:'utf8'});return {exit:result.status,...JSON.parse(result.stdout)};};
 const before=run();assert.equal(before.exit,1);assert.equal(before.findings.length,3);
 fs.writeFileSync(html,originalHtml);fs.writeFileSync(css,originalCss);
 const after=run();assert.equal(after.exit,0);assert.equal(after.findings.length,0);
 console.log(JSON.stringify({scenario:'Temporary copy: remove seeded global zoom, touch and selection restrictions',before,after,limitation:'Static rule improvement only; no physical zoom or runtime performance claim'},null,2));
} finally {fs.rmSync(temp,{recursive:true,force:true});}
