
import test from 'node:test';

import assert from 'node:assert/strict';

import {

 projectIdentity,

 projectStorageKey

} from '../src/core/ProjectIdentity.js';

import {

 EDIT_ACTIONS,

 installProjectPolicy

} from '../src/core/ProjectPolicy.js';

import {

 CityStorage

} from '../src/core/CityPersistence.js';

function setup(){

 const state={buildings:[]};

 const model={};

 for(const action of EDIT_ACTIONS){

  model[action]=()=>null;
 }

 model.place=(type,x,z)=>{

  state.buildings.push({type,x,z});

  return null;
 };

 model.undo=()=>false;

 const engine={

  state,

  construction:model,

  cityManagement:{

   loadState:()=>{}
  }
 };

 const policy=installProjectPolicy(

  engine,

  {project:'42',session:'test'}
 );

 return {engine,model,policy};
}

test('Standalone storage remains unchanged',()=>{

 assert.equal(

  projectStorageKey(null,'base'),

  'base'
 );
});

test('Projects and sessions have separate keys',()=>{

 const a=projectIdentity(

  '?project=42&session=A'
 );

 const b=projectIdentity(

  '?project=42&session=B'
 );

 const c=projectIdentity(

  '?project=53&session=A'
 );

 assert.notEqual(

  projectStorageKey(a,'base'),

  projectStorageKey(b,'base')
 );

 assert.notEqual(

  projectStorageKey(a,'base'),

  projectStorageKey(c,'base')
 );

 assert.throws(()=>projectIdentity(

  '?project=invalid%20name'
 ));
});

test('City storage is isolated by key',()=>{

 const map=new Map();

 const backend={

  getItem:key=>map.get(key)??null,

  setItem:(key,value)=>map.set(key,value)
 };

 const a=new CityStorage(backend,'A');

 const b=new CityStorage(backend,'B');

 a.autosave({city:'Project A'});

 b.autosave({city:'Project B'});

 assert.equal(

  a.read().autosave.city,'Project A'
 );

 assert.equal(

  b.read().autosave.city,'Project B'
 );
});

test('Unregistered project cannot edit',()=>{

 const {engine,model}=setup();

 assert.ok(model.place('house',800,800));

 assert.equal(engine.state.buildings.length,0);
});

test('Project rejects prohibited construction',()=>{

 const {engine,model,policy}=setup();

 policy.register({

  id:'42',

  authorize:({args})=>

   args[0]==='house'

    ?true

    :'Not permitted'
 });

 assert.equal(

  model.place('office',800,800),

  'Not permitted'
 );

 assert.equal(engine.state.buildings.length,0);

 assert.equal(

  model.place('house',800,800),

  null
 );

 assert.equal(engine.state.buildings.length,1);
});

test('Decision events contain isolated state',()=>{

 const {engine,model,policy}=setup();

 let event;

 policy.register({

  id:'42',

  authorize:()=>true,

  onDecision:e=>{

   event=e;

   e.state.buildings.length=0;
  }
 });

 model.place('house',800,800);

 assert.equal(event.action,'place');

 assert.equal(engine.state.buildings.length,1);
});

test('Project policy controls restore operations',()=>{

 const {policy}=setup();

 policy.register({

  id:'42',

  authorize:({action})=>

   action==='restore'

    ?'Restore disabled'

    :true
 });

 assert.equal(

  policy.authorizeRestore({}),

  'Restore disabled'
 );
});

test('Initial scenario loads only for new sessions',()=>{

 const first=setup();

 let loads=0;

 first.engine.cityManagement.loadState=

  ()=>loads++;

 first.policy.register({

  id:'42',

  authorize:()=>true,

  initialCity:{state:{}}
 });

 assert.equal(loads,1);

 const second=setup();

 second.engine.projectHadSave=true;

 second.engine.cityManagement.loadState=

  ()=>loads++;

 second.policy.register({

  id:'42',

  authorize:()=>true,

  initialCity:{state:{}}
 });

 assert.equal(loads,1);
});
