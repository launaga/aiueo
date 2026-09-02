import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const projectRoot=process.cwd();
const source=join(projectRoot,'.next','standalone');
const target=join(projectRoot,'dist','domainesia-root');

await rm(target,{recursive:true,force:true});
await mkdir(target,{recursive:true});
await cp(source,target,{recursive:true});
await cp(join(projectRoot,'public'),join(target,'public'),{recursive:true});
await mkdir(join(target,'.next'),{recursive:true});
await cp(join(projectRoot,'.next','static'),join(target,'.next','static'),{recursive:true});
await cp(join(projectRoot,'deployment','domainesia','README.txt'),join(target,'README-DEPLOY.txt'));
await cp(join(projectRoot,'deployment','domainesia','env.example'),join(target,'env.example'));

const packageJson=JSON.parse(await readFile(join(target,'package.json'),'utf8'));
packageJson.scripts={start:'node server.js'};
await writeFile(join(target,'package.json'),`${JSON.stringify(packageJson,null,2)}\n`);

console.log(`Domainesia application root ready: ${target}`);
console.log('Startup file: server.js');
