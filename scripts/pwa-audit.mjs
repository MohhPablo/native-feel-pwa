import fs from 'node:fs';
import path from 'node:path';
import {walk,args,main,output,fail} from './lib.mjs';
import {validateManifest} from './manifest.mjs';
export const rules=[
 ['zoom-disabled-framework','error',/userScalable\s*:\s*(?:false|["']no["'])/g,'Framework viewport disables user zoom; inspect rendered metadata and preserve zoom'],
 ['zoom-disabled','error',/user-scalable\s*[=:]\s*["']?(?:no|0)\b/ig,'User zoom restriction; preserve zoom and repair the actual interaction'],
 ['maximum-scale','warning',/maximum-scale\s*[=:]\s*["']?([\d.]+)/ig,'Maximum scale can restrict zoom; inspect the rendered viewport'],
 ['touch-none','warning',/touch-action\s*:\s*none\b/ig,'Verify this is a scoped surface with accessible alternatives, not a global gesture lock'],
 ['selection-disabled','warning',/(?:-webkit-)?user-select\s*:\s*none\b/ig,'Verify selection remains available for reading/editing content'],
 ['touch-cancel','warning',/(?:touchmove|gesturestart|contextmenu)[\s\S]{0,160}?preventDefault\s*\(/ig,'Review gesture/context-menu suppression and scope'],
 ['worker-skip-waiting','warning',/\bskipWaiting\s*\(/g,'Review update coordination, unsaved work and mixed-version clients'],
 ['worker-claim','warning',/\bclients\s*\.\s*claim\s*\(/g,'Review first-control and update behaviour across tabs'],
 ['reload','warning',/(?:location\s*\.\s*reload|location\s*\[\s*["']reload["']\s*\])\s*\(/g,'Verify bounded recovery guard; never reload on every lifecycle event'],
 ['cache-write','warning',/\b(?:cache|caches)\s*\.\s*(?:put|addAll|add)\s*\(/g,'Review allowlist, private responses and invalidation; static match is not a security finding'],
 ['cache-delete','warning',/\bcaches\s*\.\s*delete\s*\(/g,'Delete only app-owned versioned caches'],
 ['backdrop-cost','warning',/backdrop-filter\s*:/ig,'Profile paint/compositing on constrained devices before accepting blur']
];
export function audit(root,opts={}){
 const scan=walk(root,{extensions:new Set(['.html','.css','.js','.jsx','.ts','.tsx','.mjs','.json','.webmanifest','.vue','.svelte'])});
 const findings=[];let manifests=0;
 for(const f of scan.files){
   if(/(?:package-lock|pnpm-lock|yarn\.lock)/.test(f.rel))continue;
   const source=fs.readFileSync(f.full,'utf8');
   if(!['.json','.webmanifest'].includes(path.extname(f.full)))for(const [id,severity,re,message] of rules){
     re.lastIndex=0;let m;while((m=re.exec(source))){
       if(id==='maximum-scale'&&Number(m[1])>=5)continue;
       findings.push({id,severity,path:f.rel,line:source.slice(0,m.index).split('\n').length,message,confidence:'candidate'});
     }
   }
   if(f.rel.endsWith('.webmanifest') || /(^|\/)manifest\.json$/.test(f.rel)){
     manifests++;
     const publicRoot=opts.publicRoot?path.resolve(opts.publicRoot):fs.existsSync(path.join(scan.root,'public'))?path.join(scan.root,'public'):path.dirname(f.full);
     try{findings.push(...validateManifest(f.full,publicRoot).findings.map(x=>({...x,path:f.rel,confidence:'static'})));}
     catch{findings.push({id:'manifest-scan','severity':'warning',path:f.rel,message:'Manifest not inspected with supplied/inferred public root; run manifest tool explicitly',confidence:'coverage'});}
   }
 }
 if(!manifests)findings.push({id:'manifest-not-static','severity':'warning',path:'.',message:'No static manifest discovered; inspect generated/deployed metadata before concluding it is missing',confidence:'coverage'});
 return {schemaVersion:1,tool:'native-feel-pwa',filesScanned:scan.files.length,findings,skipped:scan.skipped,limitations:['Regex candidate checks include comments and may miss computed/minified/framework expressions','No WCAG, security, installability or runtime certification','No service worker is valid for an online-first app; absence is not an error']};
}
if(main(import.meta.url))try{
 const a=args(process.argv.slice(2),['--public-root'],['--strict','--json','--help']);
 if(a['--help'])console.log('node pwa-audit.mjs PROJECT [--public-root PATH] [--json] [--strict]');
 else {if(a.pos.length!==1)throw Error('Provide one project root');process.exitCode=output(audit(a.pos[0],{publicRoot:a['--public-root']}),a['--strict']);}
}catch(e){fail(e);}
