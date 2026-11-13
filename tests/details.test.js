import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {createCityState}
 from '../src/core/CityState.js';

import {buildingMassing}
 from '../src/generators/BuildingMassing.js';

import {buildingDetails}
 from '../src/generators/BuildingDetails.js';

const config=JSON.parse(fs.readFileSync(
 new URL('../scenarios/default-city.json',import.meta.url)
));

test('Architectural details are deterministic and spatially safe',()=>{

 for(let seed=0;seed<30;seed++){

  const city=createCityState({...config,seed});

  for(const b of city.buildings){

   const tiers=buildingMassing(b);
   const a=buildingDetails(b,tiers);

   assert.deepEqual(a,buildingDetails(b,tiers));

   const {width:w,depth:d,height:h}=b.dimensions;

   for(const p of a.parts){

    assert.ok(p.width>0);
    assert.ok(p.height>0);
    assert.ok(p.depth>0);

    assert.ok(
     Math.abs(p.x)+p.width/2<=w/2+3.5
    );

    assert.ok(
     Math.abs(p.z)+p.depth/2<=d/2+3.5
    );

    assert.ok(p.y-p.height/2>=0);
    assert.ok(p.y+p.height/2<=h+5);
   }
  }
 }
});

test('Riverbend contains varied roofs and facade details',()=>{

 const {buildings}=createCityState(config);

 const houses=buildings.filter(b=>b.type==='house');

 const roofs=new Set(houses.map(b=>
  buildingDetails(b,buildingMassing(b)).roofRotation
 ));

 assert.equal(roofs.size,2);

 for(const type of ['office','apartment','commercial']){

  assert.ok(buildings.filter(b=>b.type===type)
   .some(b=>buildingDetails(
    b,buildingMassing(b)
   ).parts.length>0));
 }
});
