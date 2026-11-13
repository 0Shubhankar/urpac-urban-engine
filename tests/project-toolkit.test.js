
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {

 createProject,

 validateProject,

 fileHashes,

 verifyRelease

} from '../tools/uue-toolkit.mjs';

import {

 ResearchSession

} from '../public/research-toolkit.js';

function temporary(t){

 const p=fs.mkdtempSync(

  path.join(os.tmpdir(),'uue-toolkit-test-')
 );

 t.after(()=>fs.rmSync(p,{

  recursive:true,force:true
 }));

 return p;
}

const identity={

 project:'42',

 session:'test',

 engineVersion:'1.2.0-rc.1',

 scenarioVersion:'1.0.0',

 researchVersion:'0.1.0'
};

function memoryStorage(){

 const map=new Map();

 return {

  getItem:k=>map.get(k)??null,

  setItem:(k,v)=>map.set(k,v)
 };
}

test('Project generator creates only project files',t=>{

 const base=temporary(t);

 fs.writeFileSync(

  path.join(base,'projects.json'),

  JSON.stringify({projects:[]})
 );

 const p=createProject(

  base,'42','municipal-finance',

  '1.2.0-rc.1'
 );

 assert.ok(

  fs.existsSync(path.join(p,'project.js'))
 );

 assert.ok(

  fs.existsSync(path.join(p,'README.md'))
 );

 assert.ok(

  !fs.existsSync(path.join(p,'src'))
 );

 const registry=JSON.parse(

  fs.readFileSync(

   path.join(base,'projects.json')
  )
 );

 assert.equal(registry.projects[0].id,'42');

 assert.throws(()=>createProject(

  base,'42','duplicate','1.2.0-rc.1'
 ));
});

test('Unsafe project identifiers are rejected',()=>{

 assert.throws(()=>validateProject(

  '../42','municipal-finance'
 ));

 assert.throws(()=>validateProject(

  '42','../invalid'
 ));
});

test('Research events persist across reload',()=>{

 const storage=memoryStorage();

 const first=new ResearchSession(

  identity,storage
 );

 first.record('decision-accepted',{

  action:'place'
 });

 const second=new ResearchSession(

  identity,storage
 );

 second.record('decision-rejected',{

  reason:'Not permitted'
 });

 const log=second.snapshot();

 assert.equal(log.events.length,2);

 assert.equal(log.events[1].sequence,2);
});

test('Research sessions remain independent',()=>{

 const storage=memoryStorage();

 const first=new ResearchSession(

  identity,storage
 );

 first.record('decision-accepted',{});

 const second=new ResearchSession(

  {...identity,session:'other'},storage
 );

 assert.equal(second.snapshot().events.length,0);
});

test('Research version changes require a new session',()=>{

 const storage=memoryStorage();

 const first=new ResearchSession(

  identity,storage
 );

 first.record('test',{});

 assert.throws(()=>new ResearchSession(

  {...identity,researchVersion:'0.2.0'},

  storage
 ));
});

test('Research snapshot is an independent copy',()=>{

 const session=new ResearchSession(

  identity,memoryStorage()
 );

 session.record('test',{value:1});

 const snapshot=session.snapshot();

 snapshot.events[0].data.value=999;

 assert.equal(

  session.snapshot().events[0].data.value,1
 );
});

test('Frozen release verification detects changes',t=>{

 const p=temporary(t);

 fs.writeFileSync(

  path.join(p,'index.html'),'original'
 );

 fs.writeFileSync(

  path.join(p,'release-manifest.json'),

  JSON.stringify({

   version:'1.2.0-rc.1',

   sourceCommit:'test',

   files:fileHashes(p)
  })
 );

 assert.doesNotThrow(()=>verifyRelease(p));

 fs.writeFileSync(

  path.join(p,'index.html'),'modified'
 );

 assert.throws(()=>verifyRelease(p));
});
