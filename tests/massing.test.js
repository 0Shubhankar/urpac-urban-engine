import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createCityState}
 from '../src/core/CityState.js';
import {buildingMassing}
 from '../src/generators/BuildingMassing.js';

const config=JSON.parse(fs.readFileSync(
 new URL('../scenarios/default-city.json',import.meta.url)
));

test('Massing remains within original building envelopes',()=>{

 for(let seed=0;seed<30;seed++){

  const city=createCityState({...config,seed});

  for(const b of city.buildings){

   const tiers=buildingMassing(b);

   assert.deepEqual(tiers,buildingMassing(b));
   assert.equal(tiers[0].bottom,0);
   assert.equal(tiers.at(-1).top,b.dimensions.height);

   for(let i=0;i<tiers.length;i++){

    const t=tiers[i];

    assert.ok(t.width>0);
    assert.ok(t.width<=b.dimensions.width);

    assert.ok(t.depth>0);
    assert.ok(t.depth<=b.dimensions.depth);

    assert.ok(t.top>t.bottom);

    if(i)assert.equal(t.bottom,tiers[i-1].top);
   }
  }
 }
});

test('Riverbend contains varied architectural forms',()=>{

 const {buildings}=createCityState(config);
 const offices=buildings.filter(b=>b.type==='office');

 assert.ok(offices.some(
  b=>buildingMassing(b).length===3
 ));

 assert.ok(offices.some(
  b=>buildingMassing(b).length===2
 ));

 for(const b of buildings.filter(b=>
  ['house','school','hospital','civic','commercial']
  .includes(b.type)
 )){
  assert.equal(buildingMassing(b).length,1);
 }
});
