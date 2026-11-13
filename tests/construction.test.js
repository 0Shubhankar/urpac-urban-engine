
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {createCityState}
 from '../src/core/CityState.js';

import {
 ConstructionModel,
 candidate,
 validatePlacement,
 roadsConnected
} from '../src/core/ConstructionModel.js';

const config=JSON.parse(fs.readFileSync(
 new URL('../scenarios/default-city.json',import.meta.url)
));

test('Construction protects buildings and the river',()=>{

 const s=createCityState(config);

 assert.ok(validatePlacement(
  s,'house',
  candidate('house',0,0)
 ));

 const b=s.buildings[0];

 assert.ok(validatePlacement(
  s,'house',
  candidate(
   'house',b.position.x,b.position.z
  )
 ));

 assert.ok(validatePlacement(
  s,'house',
  candidate('house',600,600)
 ));
});

test('Building construction supports undo and redo',()=>{

 const s=createCityState(config);

 const model=new ConstructionModel(s);

 const original=model.snapshot();

 let location=null;

 for(let x=-560;x<=560&&!location;x+=5){

  for(let z=-560;z<=560;z+=5){

   if(!validatePlacement(
    s,'house',candidate('house',x,z)
   )){

    location=[x,z];
    break;
   }
  }
 }

 // If the city is too dense, redevelop
 // an existing building footprint.

 if(!location){

  const p=s.parks[0];

  assert.equal(
   model.demolish(p.id),null
  );

  location=[p.position.x,p.position.z];
 }

 const before=model.snapshot();

 assert.equal(
  model.place('house',...location),null
 );

 assert.equal(
  s.buildings.length,
  before.buildings.length+1
 );

 const built=model.snapshot();

 assert.equal(model.undo(),true);

 assert.deepEqual(
  model.snapshot(),before
 );

 assert.equal(model.redo(),true);

 assert.deepEqual(
  model.snapshot(),built
 );

 assert.equal(
  original.buildings.length,132
 );
});

test('Demolition and upgrading support undo',()=>{

 const s=createCityState(config);

 const model=new ConstructionModel(s);

 const b=s.buildings[0];
 const id=b.id;
 const height=b.dimensions.height;

 assert.equal(model.upgrade(id),null);

 assert.equal(
  s.buildings[0].dimensions.height,
  height+8
 );

 assert.equal(model.undo(),true);

 assert.equal(
  s.buildings[0].dimensions.height,
  height
 );

 assert.equal(model.demolish(id),null);

 assert.equal(s.buildings.length,131);

 assert.equal(model.undo(),true);

 assert.equal(s.buildings.length,132);
});

test('Original roads and bridges are protected',()=>{

 const s=createCityState(config);

 const model=new ConstructionModel(s);

 const before=model.snapshot();

 assert.equal(
  roadsConnected(s.roads),true
 );

 for(const road of s.roads){

  assert.ok(model.demolish(road.id));
 }

 assert.deepEqual(
  model.snapshot(),before
 );
});

test('New roads require connectivity',()=>{

 const s=createCityState(config);

 // Controlled test area to isolate road logic.

 s.buildings=[];
 s.parks=[];
 s.trees=[];

 s.roads=[
  {
   ...candidate('road',300,200),
   id:'original-road'
  }
 ];

 const model=new ConstructionModel(s);

 assert.ok(validatePlacement(
  s,'road',
  candidate('road',500,500)
 ));

 assert.equal(
  model.place('road',330,230,true),
  null
 );

 assert.equal(s.roads.length,2);

 assert.equal(
  roadsConnected(s.roads),true
 );

 const id=s.roads[1].id;

 assert.equal(model.demolish(id),null);

 assert.equal(s.roads.length,1);

 assert.equal(model.undo(),true);

 assert.equal(s.roads.length,2);
});

test('Park construction and redo history work',()=>{

 const s=createCityState(config);

 const model=new ConstructionModel(s);

 const p=s.parks[0];

 assert.equal(model.demolish(p.id),null);

 assert.equal(
  model.place(
   'park',p.position.x,p.position.z
  ),null
 );

 assert.equal(s.parks.length,2);

 assert.equal(model.undo(),true);

 assert.equal(s.parks.length,1);

 const id=s.buildings[0].id;

 model.upgrade(id);

 assert.equal(model.redo(),false);
});
