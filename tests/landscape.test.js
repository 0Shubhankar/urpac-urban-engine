
import test from 'node:test';

import assert from 'node:assert/strict';

import {

 ConstructionModel

} from '../src/core/ConstructionModel.js';

import {

 cellKey,

 getCell,

 validateLandscape,

 renderLandscape

} from '../src/core/LandscapeEditor.js';

function setup(){

 const state={

  boundary:2400,

  terrain:{

   dimensions:{

    width:2400,

    depth:2400
   }
  },

  water:{

   position:{x:0,y:2,z:0},

   dimensions:{

    width:110,

    depth:2400,

    height:1
   }
  },

  buildings:[],

  roads:[],

  parks:[],

  bridges:[],

  trees:[]
 };

 return {

  state,

  model:new ConstructionModel(state)
 };
}

test('Terrain raising supports undo and redo',()=>{

 const {state,model}=setup();

 const key=cellKey(820,820);

 assert.equal(

  model.landscapeBrush(

   'raise-land',820,820,20

  ),null
 );

 assert.equal(

  getCell(state,key).height,3
 );

 assert.equal(model.undo(),true);

 assert.equal(

  getCell(state,key).height,0
 );

 assert.equal(model.redo(),true);

 assert.equal(

  getCell(state,key).height,3
 );
});

test('Terrain lowering and flattening work',()=>{

 const {state,model}=setup();

 const key=cellKey(820,820);

 model.landscapeBrush(

  'lower-land',820,820,20
 );

 assert.equal(

  getCell(state,key).height,-3
 );

 model.landscapeBrush(

  'flatten-land',820,820,20
 );

 assert.equal(

  getCell(state,key).height,0
 );
});

test('Terrain protects original city and river',()=>{

 const {model}=setup();

 assert.ok(

  model.landscapeBrush(

   'raise-land',300,300,20
  )
 );

 assert.ok(

  model.landscapeBrush(

   'pond',0,820,20
  )
 );
});

test('Terrain protects constructed buildings',()=>{

 const {model}=setup();

 assert.equal(

  model.place('house',820,820),

  null
 );

 assert.ok(

  model.landscapeBrush(

   'lower-land',820,820,20
  )
 );
});

test('Ponds prevent construction until flattened',()=>{

 const {state,model}=setup();

 const key=cellKey(820,820);

 assert.equal(

  model.landscapeBrush(

   'pond',820,820,20

  ),null
 );

 assert.equal(

  getCell(state,key).pond,true
 );

 assert.ok(

  model.place('house',820,820)
 );

 model.landscapeBrush(

  'flatten-land',820,820,20
 );

 assert.equal(

  model.place('house',820,820),

  null
 );
});

test('Vegetation brush plants and clears trees',()=>{

 const {state,model}=setup();

 assert.equal(

  model.landscapeBrush(

   'paint-trees',820,820,40

  ),null
 );

 assert.ok(state.trees.length>0);

 assert.equal(

  model.landscapeBrush(

   'clear-trees',820,820,80

  ),null
 );

 assert.equal(state.trees.length,0);

 assert.equal(model.undo(),true);

 assert.ok(state.trees.length>0);
});

test('Parcel designation supports construction',()=>{

 const {state,model}=setup();

 const key=cellKey(820,820);

 assert.equal(

  model.landscapeBrush(

   'residential-land',820,820,20

  ),null
 );

 assert.equal(

  getCell(state,key).parcel,

  'residential'
 );

 assert.equal(

  model.place('house',820,820),

  null
 );
});

test('Landscape snapshots preserve terrain',()=>{

 const {state,model}=setup();

 model.landscapeBrush(

  'raise-land',820,820,20
 );

 const saved=JSON.parse(

  JSON.stringify(model.snapshot())
 );

 const restored=setup();

 restored.model.restore(saved);

 assert.deepEqual(

  restored.state.landscape,

  state.landscape
 );

 assert.deepEqual(

  validateLandscape(

   saved.landscape,restored.state

  ),

  saved.landscape
 );
});

test('Invalid imported terrain is rejected',()=>{

 const {state}=setup();

 assert.throws(()=>validateLandscape({

  '20:20':{

   height:10000,

   pond:false,

   parcel:null
  }

 },state));

 assert.throws(()=>validateLandscape({

  '99:99':{

   height:3,

   pond:false,

   parcel:null
  }

 },state));
});

test('Terrain rendering produces finite geometry',()=>{

 const {state,model}=setup();

 model.landscapeBrush(

  'pond',820,820,20
 );

 const parts=[];

 renderLandscape({

  box:(color,...dimensions)=>{

   assert.ok(

    dimensions.every(Number.isFinite)
   );

   assert.ok(dimensions[4]>0);

   parts.push(dimensions);
  }

 },state);

 assert.ok(parts.length>2);

 // Row merging avoids one box per
 // individual cell across the world.

 assert.ok(parts.length<500);
});
