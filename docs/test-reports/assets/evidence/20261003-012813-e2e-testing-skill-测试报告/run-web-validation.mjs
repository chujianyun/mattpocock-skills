import { spawn, spawnSync } from 'node:child_process';
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const results=[];
await mkdir('evidence',{recursive:true});
for(const [name,bug] of [['api-red','api'],['api-green','']]) {
 const env={...process.env,TEST_BUG:bug};
 const r=spawnSync(process.execPath,['--test','api.test.mjs'],{env,encoding:'utf8'});
 await writeFile(`evidence/${name}.log`,r.stdout+r.stderr);results.push({name,exit:r.status});console.log(name,r.status);
}
for(const [name,bug] of [['web-red','persistence'],['web-green','']]) {
 const file=resolve(`evidence/${name}-data.json`);await writeFile(file,'[]');
 const server=spawn(process.execPath,['app.mjs'],{env:{...process.env,DATA_FILE:file,TEST_BUG:bug},stdio:['ignore','pipe','pipe']});
 try {
  const port=await new Promise((resolve,reject)=>{let text='';server.stdout.on('data',c=>{text+=c;if(text.includes('\n'))resolve(JSON.parse(text.trim()).port);});server.on('error',reject);server.on('exit',()=>reject(new Error('server exited before ready')));});
  const r=spawnSync(process.execPath,['node_modules/@playwright/test/cli.js','test'],{env:{...process.env,BASE_URL:`http://127.0.0.1:${port}`,CAPTURE_PATH:resolve(`evidence/${name}.png`)},encoding:'utf8'});
  await writeFile(`evidence/${name}.log`,r.stdout+r.stderr);results.push({name,exit:r.status});console.log(name,r.status);
 } finally {server.kill('SIGTERM');}
}
await writeFile('evidence/results.json',JSON.stringify(results,null,2));
if(results.map(x=>x.exit).join(',')!=='1,0,1,0')process.exitCode=1;
