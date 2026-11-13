
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

import {
 execFileSync
} from 'node:child_process';

import {
 fileURLToPath
} from 'node:url';

const root=path.resolve(

 path.dirname(fileURLToPath(import.meta.url)),

 '..'
);

const readJSON=p=>
 JSON.parse(fs.readFileSync(p,'utf8'));

const writeJSON=(p,value)=>

 fs.writeFileSync(

  p,JSON.stringify(value,null,2)+'\n'
 );

const version=()=>

 readJSON(path.join(root,'package.json'))
  .version;

const registryPath=path.join(
 root,'projects.json'
);

function command(program,args){

 return execFileSync(program,args,{

  cwd:root,

  encoding:'utf8',

  stdio:'pipe'
 }).trim();
}

export function validateProject(id,slug){

 if(!/^[a-zA-Z0-9_-]{1,40}$/.test(id))

  throw Error('Invalid project ID');

 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/
     .test(slug))

  throw Error(
   'Use a lowercase hyphenated project name'
  );
}

export function createProject(

 base,id,slug,engineVersion,

 engineUrl='../../'

){

 validateProject(id,slug);

 const registryFile=path.join(
  base,'projects.json'
 );

 const registry=readJSON(registryFile);

 if(registry.projects.some(p=>p.id===id))

  throw Error('Project ID already registered');

 const directory=path.join(

  base,'public','projects',id
 );

 if(fs.existsSync(directory))

  throw Error('Project directory already exists');

 const config={

  id,

  slug,

  engineVersion,

  engineUrl,

  scenarioVersion:'1.0.0',

  researchVersion:'0.1.0'
 };

 const index=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport"
 content="width=device-width,initial-scale=1">
<title>${slug}</title>
<link rel="stylesheet" href="./styles/main.css">
</head>
<body>
<header>
 <strong>Project ${id}: ${slug}</strong>
 <button id="export" disabled>
  Export experiment
 </button>
</header>
<div id="status">Loading UUE...</div>
<div id="engine"></div>
<script type="module" src="./project.js"></script>
</body>
</html>
`;

 const projectJS=`
import {
 authorize
} from './experiments/rules.js';

const config=await fetch(
 './project.config.json'
).then(r=>r.json());

const scenario=await fetch(
 './scenario.json'
).then(r=>r.json());

const engineUrl=new URL(
 config.engineUrl,location.href
);

const {
 mountUUE
}=await import(
 new URL('project-client.js',engineUrl)
);

const {
 ResearchSession,
 downloadJSON
}=await import(
 new URL('research-toolkit.js',engineUrl)
);

const sessionId=
 new URLSearchParams(location.search)
  .get('session')||'development';

const research=new ResearchSession({

 project:config.id,

 session:sessionId,

 engineVersion:config.engineVersion,

 scenarioVersion:config.scenarioVersion,

 researchVersion:config.researchVersion
});

const status=document.querySelector('#status');

try{

 const engine=await mountUUE(

  document.querySelector('#engine'),

  {

   id:config.id,

   session:sessionId,

   engineUrl:engineUrl.href,

   engineVersion:config.engineVersion,

   initialCity:scenario||undefined,

   authorize,

   onDecision(event){

    research.record(

     'decision-accepted',

     {

      action:event.action,

      args:event.args
     }
    );

    status.textContent=

     'Accepted: '+event.action;
   },

   onRejected(event){

    research.record(

     'decision-rejected',

     {

      action:event.action,

      args:event.args,

      reason:event.reason
     }
    );

    status.textContent=event.reason;
   }
  }
 );

 status.textContent=

  'Connected to UUE '+engine.version;

 const exportButton=
  document.querySelector('#export');

 exportButton.disabled=false;

 exportButton.onclick=()=>{

  downloadJSON(

   {

    research:research.snapshot(),

    city:engine.exportCity()
   },

   'project-'+config.id+

    '-'+sessionId+'.json'
  );
 };

}catch(error){

 status.textContent=

  'Startup failed: '+error.message;
}
`;

 const rules=`
/*
 Replace this function with project-specific
 research rules.

 Do not place financial or other theoretical
 assumptions inside the core UUE engine.
*/

export function authorize(decision){

 return true;
}
`;

 const styles=`
*{box-sizing:border-box}
body{
 margin:0;
 background:#192731;
 color:#e4ece7;
 font:14px system-ui,sans-serif;
}
header{
 display:flex;
 align-items:center;
 justify-content:space-between;
 gap:10px;
 padding:12px 18px;
}
button{
 padding:8px 12px;
 background:#36554b;
 border:1px solid #6e9180;
 border-radius:5px;
 color:white;
 cursor:pointer;
}
#status{
 padding:0 18px 10px;
 font-size:12px;
}
#engine{
 height:calc(100dvh - 100px);
 min-height:300px;
}
`;

 const readme=`# Project ${id} — ${slug}

Engine version: ${engineVersion}

## Start development

From the central UUE directory:

    npm run dev -- --port 5180 --strictPort

Open:

    http://localhost:5180/projects/${id}/

Start a fresh session:

    http://localhost:5180/projects/${id}/?session=test-02

## Files

project.config.json — project identity and engine dependency.
scenario.json — initial city snapshot, or null for Riverbend.
project.js — engine connection and experiment interface.
experiments/rules.js — decision validation.
models/ — project-specific mathematics.
tests/ — project-specific verification.
data/ — non-sensitive example data only.

## Important

This project must not contain a copy of the UUE engine.

Replace the initial permissive validator with the
actual experimental rules before conducting research.

Before formal data collection, pin a frozen release
URL in project.config.json and verify the scenario.

Read the central documentation:

- COMMANDS.md
- docs/PROJECT_INTEGRATION.md
- docs/PROJECT_API.md
- docs/RESEARCH_TOOLKIT.md
- docs/RELEASE_VERSIONING.md
`;

 try{

  for(const sub of [

   'models','experiments','tests','data','styles'
  ]){

   fs.mkdirSync(

    path.join(directory,sub),

    {recursive:true}
   );
  }

  writeJSON(

   path.join(directory,'project.config.json'),

   config
  );

  writeJSON(

   path.join(directory,'scenario.json'),

   null
  );

  for(const [name,content] of Object.entries({

   'index.html':index,

   'project.js':projectJS,

   'experiments/rules.js':rules,

   'styles/main.css':styles,

   'README.md':readme,

   'models/.gitkeep':'',

   'tests/.gitkeep':'',

   'data/.gitkeep':'',

   'data/.gitignore':'*\n!.gitignore\n!.gitkeep\n'
  })){

   fs.writeFileSync(

    path.join(directory,name),content
   );
  }

  registry.projects.push({

   ...config,

   path:'public/projects/'+id,

   status:'development'
  });

  writeJSON(registryFile,registry);

 }catch(error){

  fs.rmSync(directory,{

   recursive:true,force:true
  });

  throw error;
 }

 return directory;
}

// ==========================================
// RELEASE INTEGRITY
// ==========================================

export function fileHashes(directory){

 const hashes={};

 function walk(folder){

  for(const entry of fs.readdirSync(

   folder,{withFileTypes:true}
  ).sort((a,b)=>a.name.localeCompare(b.name))){

   const full=path.join(folder,entry.name);

   if(entry.isSymbolicLink())

    throw Error('Release symlinks unsupported');

   if(entry.isDirectory()){

    walk(full);

   }else if(entry.isFile()){

    const relative=path.relative(

     directory,full
    ).split(path.sep).join('/');

    if(relative==='release-manifest.json')

     continue;

    hashes[relative]=crypto

     .createHash('sha256')

     .update(fs.readFileSync(full))

     .digest('hex');
   }
  }
 }

 walk(directory);

 return hashes;
}

export function verifyRelease(directory){

 const manifest=readJSON(

  path.join(directory,'release-manifest.json')
 );

 const actual=fileHashes(directory);

 const expected=manifest.files;

 if(!expected||

    JSON.stringify(actual)!==
    JSON.stringify(expected))

  throw Error('Release files have changed');

 return manifest;
}

function freezeRelease(){

 const v=version();

 if(!/^\d+\.\d+\.\d+(?:-[a-z0-9.]+)?$/
     .test(v))

  throw Error('Invalid version');

 const destination=path.join(

  root,'public','releases',v
 );

 if(fs.existsSync(destination))

  throw Error(

   'Release already exists. Never overwrite it.'
  );

 const dirty=command(

  'git',['status','--porcelain']
 );

 if(dirty)

  throw Error(

   'Commit the verified engine source before freezing.'
  );

 const commit=command(

  'git',['rev-parse','HEAD']
 );

 console.log('Building release '+v);

 execFileSync(

  'npm',['run','build','--','--base=./'],

  {cwd:root,stdio:'inherit'}
 );

 const dist=path.join(root,'dist');

 for(const file of [

  'index.html',

  'project-client.js',

  'research-toolkit.js'
 ]){

  if(!fs.existsSync(path.join(dist,file)))

   throw Error('Missing release file: '+file);
 }

 const temporary=fs.mkdtempSync(

  path.join(root,'.uue-freeze-')
 );

 try{

  // Exclude other projects and previous releases.
  // The frozen package contains only the engine.

  for(const entry of fs.readdirSync(dist)){

   if(['releases','projects'].includes(entry))

    continue;

   fs.cpSync(

    path.join(dist,entry),

    path.join(temporary,entry),

    {recursive:true}
   );
  }

  const manifest={

   version:v,

   sourceCommit:commit,

   createdAt:new Date().toISOString(),

   files:fileHashes(temporary)
  };

  writeJSON(

   path.join(
    temporary,'release-manifest.json'
   ),

   manifest
  );

  verifyRelease(temporary);

  fs.mkdirSync(

   path.dirname(destination),

   {recursive:true}
  );

  fs.renameSync(temporary,destination);

  console.log('Frozen release: '+destination);

  console.log('Source commit: '+commit);

  console.log(

   'URL path: /urpac-urban-engine/releases/'+v+'/'
  );

  console.log(

   'Commit this release folder separately.'
  );

 }finally{

  fs.rmSync(temporary,{

   recursive:true,force:true
  });
 }
}

function verifyAll(){

 const directory=path.join(

  root,'public','releases'
 );

 if(!fs.existsSync(directory)){

  console.log('No frozen releases yet.');

  return;
 }

 for(const entry of fs.readdirSync(

  directory,{withFileTypes:true}
 )){

  if(!entry.isDirectory())continue;

  const manifest=verifyRelease(

   path.join(directory,entry.name)
  );

  if(manifest.version!==entry.name)

   throw Error('Release version mismatch');

  console.log(

   'VERIFIED '+manifest.version+
   ' · '+manifest.sourceCommit
  );
 }
}

function cli(){

 const [action,...args]=process.argv.slice(2);

 switch(action){

  case 'help':

   console.log(

    fs.readFileSync(

     path.join(root,'COMMANDS.md'),'utf8'
    )
   );

   break;

  case 'create':

   if(args.length!==2)

    throw Error(

     'Usage: npm run create-project -- ID slug'
    );

   console.log(

    'Project created: '+createProject(

     root,args[0],args[1],version()
    )
   );

   break;

  case 'list':

   console.table(

    readJSON(registryPath).projects
   );

   break;

  case 'freeze':

   freezeRelease();

   break;

  case 'verify':

   verifyAll();

   break;

  default:

   throw Error('Run npm run help');
 }
}

if(process.argv[1]&&

   path.resolve(process.argv[1])===

   fileURLToPath(import.meta.url)){

 try{

  cli();

 }catch(error){

  console.error(error.message);

  process.exitCode=1;
 }
}
