import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {walk,args} from '../scripts/lib.mjs';
import {audit} from '../scripts/pwa-audit.mjs';
import {validateManifest} from '../scripts/manifest.mjs';
import {inventory} from '../scripts/inventory.mjs';
import {budget} from '../scripts/budget.mjs';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
function fixture(t){const p=fs.mkdtempSync(path.join(os.tmpdir(),'pwa test '));t.after(()=>fs.rmSync(p,{recursive:true,force:true}));return p;}
function write(p,f,s){fs.mkdirSync(path.dirname(path.join(p,f)),{recursive:true});fs.writeFileSync(path.join(p,f),s);}
function good(t){const p=fixture(t);fs.cpSync(path.join(repo,'examples/react-vite/public'),p,{recursive:true});return p;}
function cli(script,argv){return spawnSync(process.execPath,[path.join(repo,'scripts',script),...argv],{encoding:'utf8'});}
test('valid manifest verifies real local PNG headers',t=>{const p=good(t);assert.deepEqual(validateManifest(path.join(p,'manifest.webmanifest'),p).findings,[]);});
test('symlinked ancestor of supplied root is accepted',t=>{const p=good(t),parent=fixture(t),alias=path.join(parent,'alias');try{fs.symlinkSync(p,alias,'junction');}catch(e){if(e.code==='EPERM')return t.skip('Host denies symlink creation');throw e;}assert.deepEqual(validateManifest(path.join(alias,'manifest.webmanifest'),alias).findings,[]);});
test('bad JSON is an actionable finding',t=>{const p=fixture(t);write(p,'manifest.json','{');assert.equal(validateManifest(path.join(p,'manifest.json'),p).findings[0].id,'manifest-json');});
test('non-object manifest is rejected',t=>{const p=fixture(t);write(p,'manifest.json','null');assert.equal(validateManifest(path.join(p,'manifest.json'),p).findings[0].id,'manifest-object');});
test('PNG dimension mismatch is detected',t=>{const p=good(t);const f=path.join(p,'manifest.webmanifest');const m=JSON.parse(fs.readFileSync(f));m.icons[0].sizes='100x100';write(p,'manifest.webmanifest',JSON.stringify(m));assert.ok(validateManifest(f,p).findings.some(x=>x.id==='icon-dimensions'));});
test('missing icon fails validation',t=>{const p=good(t);fs.unlinkSync(path.join(p,'icons/icon-192.png'));assert.ok(validateManifest(path.join(p,'manifest.webmanifest'),p).findings.some(x=>x.id==='icon-file'));});
test('external icon is not fetched and is reported',t=>{const p=good(t);const f=path.join(p,'manifest.webmanifest');const m=JSON.parse(fs.readFileSync(f));m.icons[0].src='https://invalid.example/icon.png';write(p,'manifest.webmanifest',JSON.stringify(m));assert.ok(validateManifest(f,p).findings.some(x=>x.id==='icon-external'));});
test('invalid start URL type and scope mismatch are errors',t=>{const p=good(t),f=path.join(p,'manifest.webmanifest');const m=JSON.parse(fs.readFileSync(f));m.start_url='/other';m.scope='/app/';m.id={};write(p,'manifest.webmanifest',JSON.stringify(m));const a=validateManifest(f,p);assert.ok(a.findings.some(x=>x.id==='manifest-scope'));assert.ok(a.findings.some(x=>x.id==='manifest-id'));});
test('relative icon resolves relative to manifest, not working directory',t=>{const p=good(t);fs.mkdirSync(path.join(p,'nested'));const m=JSON.parse(fs.readFileSync(path.join(p,'manifest.webmanifest')));m.icons=m.icons.map(i=>({...i,src:'../'+i.src.slice(1)}));write(p,'nested/manifest.webmanifest',JSON.stringify(m));assert.deepEqual(validateManifest(path.join(p,'nested/manifest.webmanifest'),p).findings,[]);});
test('encoded traversal cannot read outside public root',t=>{const p=good(t),f=path.join(p,'manifest.webmanifest');const m=JSON.parse(fs.readFileSync(f));m.icons[0].src='/%2e%2e%2fsecret.png';write(p,'manifest.webmanifest',JSON.stringify(m));assert.ok(validateManifest(f,p).findings.some(x=>x.id==='icon-file'));});
test('viewport and worker hazards include line locations without snippets',t=>{const p=good(t);write(p,'index.html','<meta name="viewport" content="user-scalable=no">\n<style>* {user-select:none}</style>');write(p,'sw.js','self.skipWaiting(); clients.claim(); location.reload(); cache.put(request,response);');const a=audit(p);for(const id of ['zoom-disabled','selection-disabled','worker-skip-waiting','worker-claim','reload','cache-write'])assert.ok(a.findings.some(x=>x.id===id));assert.equal(a.findings.find(x=>x.id==='selection-disabled').line,2);assert.ok(!JSON.stringify(a).includes('cache.put(request'));});
test('selectable zoomable online-first example has no static findings',()=>{assert.deepEqual(audit(path.join(repo,'examples/react-vite')).findings,[]);});
test('no manifest is coverage warning, not invented missing-feature error',t=>{const p=fixture(t);write(p,'app/manifest.ts','export default function manifest() {}');assert.equal(audit(p).findings[0].confidence,'coverage');});
test('secret and generated files are excluded',t=>{const p=fixture(t);write(p,'.env','SECRET=user-scalable=no');write(p,'node_modules/x/index.js','user-scalable=no');write(p,'credentials.json','SECRET');const a=audit(p);assert.ok(!a.findings.some(x=>x.id==='zoom-disabled'));assert.ok(a.skipped.length>=3);});
test('scanner reports size and count limits',t=>{const p=fixture(t);write(p,'a.js','12345');write(p,'b.js','1');assert.ok(walk(p,{maxBytes:2}).skipped.some(x=>x.reason==='file size limit'));assert.ok(walk(p,{maxFiles:1}).skipped.some(x=>x.reason==='entry count limit'));});
test('symlinks are not followed',t=>{const p=fixture(t),outside=fixture(t);write(outside,'private.js','secret');try{fs.symlinkSync(outside,path.join(p,'linked'),'junction');}catch(e){if(e.code==='EPERM')return t.skip('Host denies symlink creation');throw e;}assert.equal(walk(p).files.length,0);assert.equal(walk(p).skipped[0].reason,'symlink');});
test('icon symlink is rejected even within root',t=>{const p=good(t);const icon=path.join(p,'icons/icon-192.png');fs.renameSync(icon,icon+'.bak');try{fs.symlinkSync(icon+'.bak',icon);}catch(e){if(e.code==='EPERM')return t.skip('Host denies symlink creation');throw e;}assert.ok(validateManifest(path.join(p,'manifest.webmanifest'),p).findings.some(x=>x.id==='icon-file'));});
test('inventory identifies components and does not print private dependency URLs',t=>{const p=fixture(t);write(p,'package.json',JSON.stringify({dependencies:{react:'https://user:secret@example.test'}}));write(p,'src/components/Dialog.tsx','');const i=inventory(p);assert.deepEqual(i.packages[0].dependencies,['react']);assert.ok(i.candidates.includes('src/components/Dialog.tsx'));assert.ok(!JSON.stringify(i).includes('secret'));});
test('malformed package manifest does not silently pass',t=>{const p=fixture(t);write(p,'package.json','{');assert.throws(()=>inventory(p));});
test('bundle ceiling passes/fails and includes .next when it is build root',t=>{const p=fixture(t);write(p,'.next/static/chunks/a.js','console.log("hello");');assert.equal(budget(path.join(p,'.next'),1000).passed,true);assert.equal(budget(path.join(p,'.next'),1).passed,false);});
test('empty bundle and invalid budget throw instead of pass',t=>{const p=fixture(t);assert.throws(()=>budget(p));assert.throws(()=>budget(p,NaN));assert.throws(()=>budget(p,-1));});
test('CLI path with spaces, findings and usage exit codes',t=>{const p=good(t);assert.equal(cli('pwa-audit.mjs',[p,'--strict']).status,0);write(p,'index.html','user-scalable=no');assert.equal(cli('pwa-audit.mjs',[p]).status,1);assert.equal(cli('pwa-audit.mjs',[p,'--unknown']).status,2);assert.equal(cli('pwa-audit.mjs',[]).status,2);assert.equal(cli('budget.mjs',[p]).status,2);});
test('warning fails strict only',t=>{const p=fixture(t);assert.equal(cli('pwa-audit.mjs',[p]).status,0);assert.equal(cli('pwa-audit.mjs',[p,'--strict']).status,1);});
test('flags reject missing values',()=>assert.throws(()=>args(['--root'],['--root'])));

test('framework viewport restriction is flagged',t=>{const p=fixture(t);write(p,'app/layout.tsx','export const viewport = {userScalable: false};');assert.ok(audit(p).findings.some(x=>x.id==='zoom-disabled-framework'));});
test('oversized manifest fails bounded inspection',t=>{const p=fixture(t);write(p,'manifest.json',' '.repeat(1024*1024+1));assert.throws(()=>validateManifest(path.join(p,'manifest.json'),p),/inspection limit/);});
test('PascalCase JSX is inventoried outside a components directory',t=>{const p=fixture(t);write(p,'src/Reader.jsx','');assert.deepEqual(inventory(p).candidates,['src/Reader.jsx']);});

test('budget cannot pass when hidden or sensitive output is omitted',t=>{const p=fixture(t);write(p,'main.js','x');write(p,'.hidden/chunk.js','y');write(p,'secret.js','z');const b=budget(p,200000);assert.equal(b.passed,false);assert.equal(b.incomplete,true);});

test('unrelated package suffix does not abort inventory',t=>{const p=fixture(t);write(p,'not-package.json','null');write(p,'package.json','{}');assert.equal(inventory(p).packages.length,1);});
test('invalid manifest and icon field types are errors',t=>{const p=good(t),f=path.join(p,'manifest.webmanifest');const m=JSON.parse(fs.readFileSync(f));m.icons[0].purpose=42;m.theme_color={};m.name=1;write(p,'manifest.webmanifest',JSON.stringify(m));const a=validateManifest(f,p);assert.ok(a.findings.some(x=>x.id==='icon-purpose'));for(const id of ['manifest-theme_color','manifest-name'])assert.ok(a.findings.some(x=>x.id===id&&x.severity==='error'));});

test('purpose allows surrounding whitespace',t=>{const p=good(t),f=path.join(p,'manifest.webmanifest');const m=JSON.parse(fs.readFileSync(f));m.icons[0].purpose=' any ';write(p,'manifest.webmanifest',JSON.stringify(m));assert.deepEqual(validateManifest(f,p).findings,[]);});
