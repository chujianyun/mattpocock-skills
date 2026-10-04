import http from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
export function createApp(file, bug = '') {
  return http.createServer(async (req, res) => {
    const send = (code, data) => { res.writeHead(code, {'Content-Type':'application/json'}); res.end(JSON.stringify(data)); };
    try {
      if(req.url === '/') {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(`<!doctype html><html lang="en"><title>Acceptance Notes</title><style>body{font:20px system-ui;max-width:640px;margin:60px auto}input,button{font:inherit;margin:12px;padding:8px}</style><h1>Acceptance Notes</h1><label>Title<input id="title"></label><button id="save">Save</button><ul id="notes"></ul><script>
        async function refresh(){ const rows=await (await fetch('/notes')).json(); document.querySelector('#notes').replaceChildren(...rows.map(row=>{ const li=document.createElement('li');li.textContent=row.title;return li; })); }
        document.querySelector('#save').onclick=async()=>{ const title=document.querySelector('#title').value; const r=await fetch('/notes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title})});if(r.ok)await refresh(); }; refresh();
        </script></html>`); return;
      }
      const rows = JSON.parse(await readFile(file,'utf8'));
      if(req.url === '/notes' && req.method === 'POST') {
        let text='';for await(const chunk of req)text+=chunk;
        const input=JSON.parse(text);
        if(typeof input.title !== 'string' || !input.title.trim())return send(400,{error:'title required'});
        const row={id:randomUUID(),title:bug==='api'?'Wrong title':input.title};
        if(bug !== 'persistence')await writeFile(file,JSON.stringify([...rows,row]));
        return send(201,row);
      }
      if(req.url === '/notes')return send(200,rows);
      if(req.url.startsWith('/notes/')) { const row=rows.find(x=>x.id===req.url.split('/')[2]);return row?send(200,row):send(404,{error:'not found'}); }
      send(404,{error:'not found'});
    } catch { send(500,{error:'test server error'}); }
  });
}
if(process.argv[1]?.endsWith('/app.mjs')) {
 const server=createApp(process.env.DATA_FILE,process.env.TEST_BUG);
 server.listen(0,'127.0.0.1',()=>console.log(JSON.stringify({port:server.address().port})));
}
