import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const excluded = new Set(['node_modules','.git','.next','dist','build','coverage','.turbo','vendor','test-results','playwright-report']);
export const sensitive = n => /^(\.env(?:\..*)?|.*\.(?:pem|key|p12|pfx)|credentials.*|secrets?\..*)$/i.test(n);
export function main(meta) { return process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(meta); }
export function inside(root, target) { const p=path.relative(root,target); return p==='' || (!p.startsWith('..'+path.sep) && p!=='..' && !path.isAbsolute(p)); }
export function safeFile(root, target) {
  const lexicalRoot=path.resolve(root), lexicalTarget=path.resolve(target);
  if (!inside(lexicalRoot,lexicalTarget)) throw new Error('Asset resolves outside supplied root');
  const base=fs.realpathSync(root), resolved=fs.realpathSync(target);
  if (!inside(base,resolved)) throw new Error('Asset resolves outside supplied root');
  // A root itself may have a symlinked OS ancestor (for example macOS /var).
  // Reject links in the supplied asset path without rejecting that ancestor.
  let current=lexicalRoot;
  for (const part of path.relative(lexicalRoot,lexicalTarget).split(path.sep).filter(Boolean)) {
    current=path.join(current,part); if(fs.lstatSync(current).isSymbolicLink()) throw new Error('Symlink asset is not inspected');
  }
  if(!fs.statSync(resolved).isFile()) throw new Error('Expected regular file');
  return resolved;
}
export function walk(root,{maxFiles=10000,maxBytes=1024*1024,extensions=null,skipGenerated=true}={}) {
  root=fs.realpathSync(root); if(!fs.statSync(root).isDirectory()) throw new Error('Project root must be a directory');
  const files=[],skipped=[]; let count=0,limited=false;
  function visit(dir) {
    for(const e of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
      if(++count>maxFiles){limited=true;return;}
      const full=path.join(dir,e.name),rel=path.relative(root,full).split(path.sep).join('/');
      if(e.isSymbolicLink()){skipped.push({path:rel,reason:'symlink'});continue;}
      if(sensitive(e.name)){skipped.push({path:rel,reason:'sensitive filename'});continue;}
      if(e.isDirectory()){
        if(e.name.startsWith('.') || (skipGenerated && excluded.has(e.name)) || e.name==='node_modules'){skipped.push({path:rel,reason:'excluded directory'});continue;}
        visit(full); if(limited)return;
      }else if(e.isFile() && (!extensions || extensions.has(path.extname(e.name)))){
        if(fs.statSync(full).size>maxBytes){skipped.push({path:rel,reason:'file size limit'});continue;}
        files.push({full,rel});
      }
    }
  }
  visit(root); if(limited)skipped.push({path:'.',reason:'entry count limit'});
  return {root,files,skipped};
}
export function args(argv, valueFlags=[], booleanFlags=[]) {
  const result={pos:[]};
  for(let i=0;i<argv.length;i++){
    const a=argv[i];
    if(valueFlags.includes(a)) { if(!argv[i+1] || argv[i+1].startsWith('--'))throw new Error(`Missing value for ${a}`);result[a]=argv[++i]; }
    else if(booleanFlags.includes(a))result[a]=true;
    else if(a.startsWith('--'))throw new Error(`Unknown option ${a}`);
    else result.pos.push(a);
  }
  return result;
}
export function output(report, strict=false){console.log(JSON.stringify(report,null,2));return report.findings?.some(f=>f.severity==='error'||strict&&f.severity==='warning')?1:0;}
export function fail(error){console.error(`Tool error: ${error.message}`);process.exitCode=2;}
