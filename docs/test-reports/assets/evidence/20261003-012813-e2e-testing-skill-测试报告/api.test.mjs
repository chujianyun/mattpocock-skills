import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from './app.mjs';
async function fixture(t) {
 const dir=await mkdtemp(join(tmpdir(),'acceptance-api-'));const file=join(dir,'notes.json');await writeFile(file,'[]');
 const app=createApp(file,process.env.TEST_BUG);t.after(async()=>{await new Promise(r=>app.close(r));await rm(dir,{recursive:true});});return app;
}
test('created note remains retrievable through HTTP',async t=>{
 const app=await fixture(t);const created=await request(app).post('/notes').send({title:'Acceptance note'}).expect(201);
 const fetched=await request(app).get(`/notes/${created.body.id}`).expect(200);
 assert.equal(fetched.body.title,'Acceptance note');
});
test('invalid title is rejected without writing a note',async t=>{
 const app=await fixture(t);await request(app).post('/notes').send({title:''}).expect(400);
 const rows=await request(app).get('/notes').expect(200);assert.deepEqual(rows.body,[]);
});
