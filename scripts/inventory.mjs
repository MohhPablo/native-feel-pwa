import fs from 'node:fs';
import {walk,args,main,fail} from './lib.mjs';
export function inventory(root){
 const scan=walk(root,{extensions:new Set(['.json','.jsx','.tsx','.vue','.svelte','.js','.ts'])});
 const packages=[],candidates=[];
 for(const f of scan.files){
  if(f.rel.split('/').at(-1)==='package.json'){
    const p=JSON.parse(fs.readFileSync(f.full,'utf8'));
    if(!p || typeof p!=='object' || Array.isArray(p))throw Error('Package manifest must be an object');
    packages.push({path:f.rel,dependencies:Object.keys(p.dependencies||{}).sort(),devDependencies:Object.keys(p.devDependencies||{}).sort()});
  }else if((/(?:components?\/|(?:dialog|drawer|button|carousel|modal|sheet|input)\.)/i.test(f.rel) || /(?:^|\/)[A-Z][^/]*\.(?:jsx|tsx)$/.test(f.rel)))candidates.push(f.rel);
 }
 return {schemaVersion:1,packages,candidates,skipped:scan.skipped,limitations:['Names only; inspect implementations, imports, lockfiles and licensing before decisions','Dependency URLs/values and source snippets are deliberately not printed']};
}
if(main(import.meta.url))try{
 const a=args(process.argv.slice(2),[],['--help']);if(a['--help'])console.log('node inventory.mjs PROJECT');
 else{if(a.pos.length!==1)throw Error('Provide one project root');console.log(JSON.stringify(inventory(a.pos[0]),null,2));}
}catch(e){fail(e);}
