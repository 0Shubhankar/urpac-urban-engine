import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createCityState} from '../src/core/CityState.js';

const config=JSON.parse(fs.readFileSync(
 new URL('../scenarios/default-city.json',import.meta.url)
));

const overlap=(a,b,pad=0)=>
 Math.abs(a.position.x-b.position.x)<
 (a.dimensions.width+b.dimensions.width)/2+pad &&
 Math.abs(a.position.z-b.position.z)<
 (a.dimensions.depth+b.dimensions.depth)/2+pad;

test('Riverbend road expansion preserves buildings and bridges',()=>{
 const city=createCityState(config);
 const base=createCityState({
  ...config,roadNetwork:undefined
 });

 assert.equal(city.roads.length,base.roads.length+6);
 assert.equal(
  city.roads.filter(r=>r.type==='collector').length,2
 );

 assert.deepEqual(city.buildings,base.buildings);
 assert.deepEqual(city.bridges,base.bridges);

 for(const link of city.roads.filter(
  r=>r.id.startsWith('link-')
 )){
  assert.equal(city.roads.filter(
   r=>r!==link&&overlap(r,link)
  ).length,2);
 }
});

test('New roads clear parks, water and trees across 30 seeds',()=>{
 for(let seed=0;seed<30;seed++){
  const s=createCityState({...config,seed});

  for(const r of s.roads.filter(r=>r.axis)){
   for(const p of [...s.parks,s.water])
    assert.ok(!overlap(p,r,5));

   for(const t of s.trees)
    assert.ok(!overlap({
     ...t,
     dimensions:{
      ...t.dimensions,
      depth:t.dimensions.width
     }
    },r,5));
  }
 }
});
