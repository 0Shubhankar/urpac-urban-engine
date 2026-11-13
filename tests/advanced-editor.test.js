
import test from 'node:test';

import assert from 'node:assert/strict';

import {

 ConstructionModel

} from '../src/core/ConstructionModel.js';

import {

 ASSETS,

 renderAsset

} from '../src/core/AssetLibrary.js';

import {

 measureDistance,

 measureArea,

 visibleState

} from '../src/core/SpatialEditing.js';

function setup(){

 const state={

  boundary:2400,

  terrain:{

   dimensions:{

    width:2400,depth:2400
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

  bridges:[],

  parks:[],

  trees:[],

  landscape:{}
 };

 return {

  state,

  model:new ConstructionModel(state)
 };
}

test('All new assets can be constructed',()=>{

 const {state,model}=setup();

 Object.keys(ASSETS).forEach((type,i)=>{

  const x=250+(i%4)*220;

  const z=-900+Math.floor(i/4)*220;

  assert.equal(

   model.place(type,x,z),

   null,type
  );
 });

 assert.equal(

  state.buildings.length,

  Object.keys(ASSETS).length
 );
});

test('New assets produce valid geometry',()=>{

 const {state,model}=setup();

 for(const type of Object.keys(ASSETS)){

  const s=setup();

  assert.equal(

   s.model.place(type,820,820),

   null
  );

  let count=0;

  const check=(...numbers)=>{

   assert.ok(numbers.every(Number.isFinite));

   count++;
  };

  renderAsset({

   box:(color,x,y,z,w,h,d,id)=>

    check(x,y,z,w,h,d),

   part:(shape,color,x,y,z,w,h,d,id)=>

    check(x,y,z,w,h,d)

  },s.state.buildings[0]);

  assert.ok(count>0,type);
 }
});

test('Group movement preserves relative positions',()=>{

 const {state,model}=setup();

 model.place('house',700,700);

 model.place('house',800,700);

 const ids=state.buildings.map(b=>b.id);

 const before=model.snapshot();

 assert.equal(

  model.groupEdit(ids,'move',100,100),

  null
 );

 assert.equal(

  state.buildings[0].position.x,800
 );

 assert.equal(

  state.buildings[1].position.x,900
 );

 assert.equal(model.undo(),true);

 assert.deepEqual(model.snapshot(),before);
});

test('Invalid group movement is atomic',()=>{

 const {state,model}=setup();

 model.place('house',700,700);

 model.place('house',800,700);

 const before=model.snapshot();

 assert.ok(

  model.groupEdit(

   state.buildings.map(b=>b.id),

   'move',-700,0
  )
 );

 assert.deepEqual(model.snapshot(),before);
});

test('Group deletion is one undoable operation',()=>{

 const {state,model}=setup();

 model.place('house',700,700);

 model.place('house',800,700);

 assert.equal(

  model.groupEdit(

   state.buildings.map(b=>b.id),

   'delete'
  ),

  null
 );

 assert.equal(state.buildings.length,0);

 assert.equal(model.undo(),true);

 assert.equal(state.buildings.length,2);
});

test('Distance and area are calculated correctly',()=>{

 assert.equal(

  measureDistance([[0,0],[3,4]]),5
 );

 assert.equal(

  measureArea([

   [0,0],[20,0],[20,30],[0,30]

  ]),

  600
 );
});

test('Layer filtering never modifies actual city',()=>{

 const {state,model}=setup();

 model.place('house',700,700);

 state.landscape['20:20']={

  height:0,

  pond:false,

  parcel:'residential'
 };

 const filtered=visibleState(state,{

  buildings:false,

  parcels:false
 });

 assert.equal(filtered.buildings.length,0);

 assert.equal(state.buildings.length,1);

 assert.equal(

  filtered.landscape['20:20'].parcel,

  null
 );

 assert.equal(

  state.landscape['20:20'].parcel,

  'residential'
 );
});
