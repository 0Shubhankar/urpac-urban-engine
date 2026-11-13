
import test from 'node:test';

import assert from 'node:assert/strict';

import fs from 'node:fs';

import {
 createCityState
} from '../src/core/CityState.js';

import {
 ConstructionModel
} from '../src/core/ConstructionModel.js';

import {
 resizeWorld
} from '../src/core/UniversalEditing.js';

import {
 makeSave,
 validateSave
} from '../src/core/CityPersistence.js';

const config=JSON.parse(
 fs.readFileSync(
  new URL(
   '../scenarios/default-city.json',
   import.meta.url
  )
 )
);

function setup(){

 const state=createCityState(config);

 resizeWorld(state,2400);

 return {

  state,

  model:new ConstructionModel(state)
 };
}

test('World expansion preserves original city',()=>{

 const {state,model}=setup();

 assert.equal(state.boundary,2400);

 assert.equal(state.buildings.length,132);

 assert.equal(model.expand(),null);

 assert.equal(state.boundary,3600);

 assert.equal(
  state.water.dimensions.depth,3600
 );

 assert.equal(
  state.terrain.dimensions.width,3600
 );

 assert.equal(state.buildings.length,132);

 assert.equal(model.undo(),true);

 assert.equal(state.boundary,2400);

 assert.equal(model.redo(),true);

 assert.equal(state.boundary,3600);
});

test('Buildings can be constructed in expansion areas',()=>{

 const {state,model}=setup();

 assert.equal(
  model.place('house',850,850),
  null
 );

 assert.equal(
  state.buildings.length,133
 );

 assert.ok(
  model.place('house',1300,1300)
 );

 model.expand();

 assert.equal(
  model.place('house',1300,1300),
  null
 );
});

test('Buildings can move and resize',()=>{

 const {state,model}=setup();

 const id=state.buildings[0].id;

 assert.equal(
  model.edit(id,{
   x:850,
   z:850,
   width:40,
   depth:50,
   height:60,
   district:'Expansion Quarter',
   color:'#aabbcc'
  }),
  null
 );

 const b=model.find(id).object;

 assert.equal(b.position.x,850);

 assert.equal(b.dimensions.width,40);

 assert.equal(b.dimensions.height,60);

 assert.equal(b.visual.color,'#aabbcc');

 assert.equal(
  b.district,'Expansion Quarter'
 );

 assert.equal(model.undo(),true);

 assert.notEqual(
  model.find(id).object.position.x,850
 );
});

test('Quarter-turn rotation preserves footprint dimensions',()=>{

 const {state,model}=setup();

 const id=state.buildings[0].id;

 model.edit(id,{
  x:850,z:850,
  width:30,depth:50
 });

 assert.equal(
  model.edit(id,{rotate:true}),
  null
 );

 const b=model.find(id).object;

 assert.equal(b.dimensions.width,50);

 assert.equal(b.dimensions.depth,30);

 assert.equal(
  b.orientation,Math.PI/2
 );
});

test('Invalid edits leave the city unchanged',()=>{

 const {state,model}=setup();

 const id=state.buildings[0].id;

 const before=model.snapshot();

 assert.ok(
  model.edit(id,{x:0,z:0})
 );

 assert.ok(
  model.edit(id,{width:-10})
 );

 assert.deepEqual(
  model.snapshot(),before
 );
});

test('Objects can be duplicated with unique IDs',()=>{

 const {state,model}=setup();

 const b=state.buildings[0];

 assert.equal(
  model.duplicate(b.id,850,850),
  null
 );

 const copy=state.buildings.at(-1);

 assert.notEqual(copy.id,b.id);

 assert.deepEqual(
  copy.dimensions,b.dimensions
 );
});

test('Trees can be placed moved and deleted',()=>{

 const {state,model}=setup();

 const count=state.trees.length;

 assert.equal(
  model.place('tree',850,850),
  null
 );

 const tree=state.trees.at(-1);

 assert.equal(
  state.trees.length,count+1
 );

 assert.equal(
  model.edit(tree.id,{
   x:950,z:950
  }),
  null
 );

 assert.equal(
  model.demolish(tree.id),
  null
 );

 assert.equal(
  state.trees.length,count
 );

 assert.equal(model.undo(),true);

 assert.equal(
  state.trees.length,count+1
 );
});

test('Original roads remain protected',()=>{

 const {state,model}=setup();

 const id=state.roads[0].id;

 assert.ok(
  model.edit(id,{width:50})
 );

 assert.ok(model.demolish(id));
});

test('Expanded workspace survives save and restore',()=>{

 const {state,model}=setup();

 const baseline=model.snapshot();

 model.expand();

 model.place('house',1300,1300);

 const save=makeSave(state,model);

 const restored=validateSave(
  JSON.parse(JSON.stringify(save)),
  baseline
 );

 const next=setup();

 next.model.restore(restored.state);

 assert.equal(
  next.state.boundary,3600
 );

 assert.equal(
  next.state.buildings.length,133
 );

 assert.equal(
  next.state.water.dimensions.depth,3600
 );
});
