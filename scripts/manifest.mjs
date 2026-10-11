import fs from 'node:fs';
import path from 'node:path';
import {args,main,output,fail,safeFile,inside} from './lib.mjs';
export function validateManifest(file,root=path.dirname(file)) {
  root=fs.realpathSync(root); file=safeFile(root,path.resolve(file));
  if(fs.statSync(file).size>1024*1024)throw new Error('Manifest exceeds 1 MiB inspection limit');
  const findings=[]; const add=(id,severity,message)=>findings.push({id,severity,path:path.relative(root,file).split(path.sep).join('/'),message});
  let m;
  try{m=JSON.parse(fs.readFileSync(file,'utf8'));}catch{add('manifest-json','error','Manifest must be valid JSON');return {findings};}
  if(!m || typeof m!=='object' || Array.isArray(m)){add('manifest-object','error','Manifest must be an object');return {findings};}
  for(const key of ['name','short_name','theme_color','background_color'])if(m[key]!==undefined && typeof m[key]!=='string')add('manifest-'+key,'error',`${key} must be a string`);
  if(![m.name,m.short_name].some(x=>typeof x==='string'&&x.trim()))add('manifest-name','error','Provide name or short_name');
  const origin='https://audit.invalid';
  const base=new URL('/'+path.relative(root,file).split(path.sep).join('/'),origin);
  function url(key,fallback){
    if(m[key]===undefined){add('manifest-'+key,'warning',`Explicit ${key} recommended for predictable install identity/scope`);return new URL(fallback,base);}
    if(typeof m[key]!=='string'){add('manifest-'+key,'error',`${key} must be a string`);return null;}
    try{const u=new URL(m[key],base);if(u.origin!==origin){add('manifest-'+key,'error',`${key} must be same-origin for this local audit`);return null;}return u;}
    catch{add('manifest-'+key,'error',`${key} is not a valid URL`);return null;}
  }
  const start=url('start_url','./'),scope=url('scope','./'); url('id','./');
  if(start && scope && !start.pathname.startsWith(scope.pathname))add('manifest-scope','error','start_url is outside scope');
  if(!['standalone','minimal-ui','fullscreen','browser'].includes(m.display))add('manifest-display','warning','Choose an explicit valid display mode');
  if(!Array.isArray(m.icons)||!m.icons.length){add('manifest-icons','error','Provide icons');return {findings};}
  const seen=new Set();
  for(const icon of m.icons){
    if(!icon || typeof icon.src!=='string' || !icon.src){add('icon-src','error','Icon requires a nonempty src');continue;}
    const sizes=typeof icon.sizes==='string'?icon.sizes.trim().split(/\s+/):[];
    if(!sizes.length || sizes.some(s=>!/^([1-9]\d*x[1-9]\d*|any)$/.test(s)))add('icon-sizes','error','Icon sizes must contain dimensions or any');
    if(icon.purpose!==undefined && typeof icon.purpose!=='string')add('icon-purpose','warning','Non-string icon purpose falls back to any in browsers; use an explicit string');
    if(icon.type!==undefined && typeof icon.type!=='string')add('icon-mime','error','Icon type must be a string');
    const purposes=typeof icon.purpose==='string'?icon.purpose.trim().split(/\s+/).filter(Boolean):['any'];
    if(!purposes.some(p=>['any','maskable','monochrome'].includes(p)))add('icon-purpose','error','Icon has no recognized purpose');
    else if(purposes.some(p=>!['any','maskable','monochrome'].includes(p)))add('icon-purpose','warning','Unknown purpose tokens are ignored by browsers; verify intended purpose');
    let u;
    try{u=new URL(icon.src,base);}catch{add('icon-url','error','Invalid icon URL');continue;}
    if(u.origin!==origin){add('icon-external','warning','External/data icon not fetched; verify MIME, dimensions and availability manually');continue;}
    let asset;
    try{asset=path.resolve(root,'.'+decodeURIComponent(u.pathname));if(!inside(root,asset))throw Error();asset=safeFile(root,asset);}
    catch{add('icon-file','error','Icon missing, unsafe, symlinked or outside root');continue;}
    const size=fs.statSync(asset).size;
    if(size>5*1024*1024){add('icon-large','warning','Icon exceeds 5 MiB; binary inspection skipped');continue;}
    const b=fs.readFileSync(asset);
    if(b.length>=24 && b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) && b.toString('ascii',12,16)==='IHDR'){
      const actual=`${b.readUInt32BE(16)}x${b.readUInt32BE(20)}`;
      if(!sizes.includes(actual))add('icon-dimensions','error',`Declared size differs from PNG header (${actual})`);
      else if(purposes.includes('any'))seen.add(actual);
      if(icon.type && icon.type!=='image/png')add('icon-mime','error','PNG header and declared MIME disagree');
    }else add('icon-format','warning','Only PNG header dimensions are inspected; decode and visually verify other formats');
  }
  for(const s of ['192x192','512x512'])if(!seen.has(s))add('icon-'+s,'warning',`No locally verified any-purpose PNG ${s}; check target installation requirements`);
  return {findings,limitations:['PNG header check does not prove full image integrity or safe-zone artwork','No HTTP response, install prompt, dynamic manifest or runtime checks']};
}
if(main(import.meta.url))try{
 const a=args(process.argv.slice(2),['--root'],['--strict','--help']);
 if(a['--help'])console.log('node manifest.mjs FILE [--root PUBLIC_ROOT] [--strict]');
 else {if(a.pos.length!==1)throw Error('Provide one manifest path');process.exitCode=output(validateManifest(a.pos[0],a['--root']),a['--strict']);}
}catch(e){fail(e);}
