import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';

import {createCityState}
 from '../src/core/CityState.js';

import {parkDetails}
 from '../src/generators/ParkDetails.js';

import {addLighting,setLightingMode}
 from '../src/renderer/Lighting.js';

const config=JSON.parse(fs.readFileSync(
 new URL('../scenarios/default-city.json',import.meta.url)
));

test('Park furniture is deterministic and stays inside parks',()=>{

 for(let seed=0;seed<30;seed++){

  const state=createCityState({...config,seed});
  const parts=parkDetails(state);

  assert.deepEqual(parts,parkDetails(state));

  for(const p of parts){

   const park=state.parks.find(
    q=>q.id===p.parkId
   );

   assert.ok(park);

   assert.ok(
    Math.abs(p.x-park.position.x)+p.width/2
    <=park.dimensions.width/2
   );

   assert.ok(
    Math.abs(p.z-park.position.z)+p.depth/2
    <=park.dimensions.depth/2
   );

   for(const t of state.trees){

    const overlap=
     Math.abs(p.x-t.position.x)<
      (p.width+t.dimensions.width)/2 &&
     Math.abs(p.z-t.position.z)<
      (p.depth+t.dimensions.width)/2;

    assert.ok(!overlap);
   }
  }
 }
});

test('Day and night lighting is reversible',()=>{

 const scene=new THREE.Scene();
 const lights=addLighting(scene);

 assert.equal(lights.sun.intensity,3.2);

 setLightingMode(lights,true);

 assert.equal(lights.sun.castShadow,false);
 assert.ok(lights.sun.intensity<3.2);

 setLightingMode(lights,false);

 assert.equal(lights.sun.intensity,3.2);
 assert.equal(lights.hemisphere.intensity,2.5);
 assert.equal(lights.sun.castShadow,true);
});
