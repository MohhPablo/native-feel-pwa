import fs from 'node:fs';
import {gzipSync} from 'node:zlib';
import {walk,args,main,fail} from './lib.mjs';
export function budget(root,max=200000){
 if(!Number.isSafeInteger(max)||max<=0)throw Error('Budget must be a positive integer number of bytes');
 const scan=walk(root,{skipGenerated:false,maxBytes:50*1024*1024,extensions:new Set(['.js','.mjs'])});
 const files=scan.files.map(f=>({path:f.rel,gzipBytes:gzipSync(fs.readFileSync(f.full),{level:9}).length}));
 if(!files.length)throw Error('No JavaScript found; build first and select its output directory');
 const total=files.reduce((a,f)=>a+f.gzipBytes,0),incomplete=scan.skipped.length>0;
 return {schemaVersion:1,files,totalGzipBytes:total,budgetBytes:max,passed:total<=max&&!incomplete,incomplete,skipped:scan.skipped,limitations:['Sum of all JS files, not an initial-route transfer or parse-time measurement','Per-file gzip level 9; server encoding may differ']};
}
if(main(import.meta.url))try{
 const a=args(process.argv.slice(2),['--max-js-gzip'],['--help']);if(a['--help'])console.log('node budget.mjs BUILD_DIR [--max-js-gzip BYTES]');
 else{if(a.pos.length!==1)throw Error('Provide one build directory');const r=budget(a.pos[0],a['--max-js-gzip']?Number(a['--max-js-gzip']):200000);console.log(JSON.stringify(r,null,2));process.exitCode=r.passed?0:1;}
}catch(e){fail(e);}
