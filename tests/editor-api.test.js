
import test from 'node:test';

import assert from 'node:assert/strict';

import {

 createEditorAPI

} from '../src/core/EditorAPI.js';

function setup(){

 const state={

  buildings:[

   {id:'b1',height:20}
  ]
 };

 let rebuilds=0;

 const engine={

  state,

  construction:{

   find:id=>{

    const object=state.buildings.find(

     b=>b.id===id
    );

    return object

     ?{key:'buildings',object}

     :null;
   },

   place(type,x,z){

    state.buildings.push({

     id:'b2',type,x,z
    });

    return null;
   },

   edit(){

    return 'Invalid operation';
   },

   undo(){

    return false;
   }
  },

  cityManagement:{

   inventory:()=>({

    buildings:state.buildings.length
   }),

   exportState:()=>({state}),

   loadState:()=>{}
  },

  rebuildCity(){

   rebuilds++;
  }
 };

 return {

  engine,

  api:createEditorAPI(engine),

  rebuilds:()=>rebuilds
 };
}

test('Editor state access returns an isolated copy',()=>{

 const {engine,api}=setup();

 const copy=api.getState();

 copy.buildings[0].height=999;

 assert.equal(

  engine.state.buildings[0].height,

  20
 );
});

test('Object access cannot mutate city state',()=>{

 const {engine,api}=setup();

 const object=api.getObject('b1');

 object.height=999;

 assert.equal(

  engine.state.buildings[0].height,

  20
 );

 assert.equal(

  api.getObject('missing'),

  null
 );
});

test('Successful API commands rebuild the city',()=>{

 const {api,rebuilds}=setup();

 assert.deepEqual(

  api.execute('place','house',850,850),

  {ok:true,error:null}
 );

 assert.equal(rebuilds(),1);

 assert.equal(

  api.getInventory().buildings,

  2
 );
});

test('Invalid commands do not trigger rebuild',()=>{

 const {api,rebuilds}=setup();

 assert.equal(

  api.execute('edit','b1').ok,

  false
 );

 assert.equal(

  api.execute('undo').ok,

  false
 );

 assert.equal(rebuilds(),0);
});

test('Unsupported API actions are rejected',()=>{

 const {api}=setup();

 assert.throws(()=>

  api.execute('restore')
 );
});
