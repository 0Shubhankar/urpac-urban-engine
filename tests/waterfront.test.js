import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {createCityState}
 from '../src/core/CityState.js';

import {waterfrontParts}
 from '../src/generators/Waterfront.js';

const config=JSON.parse(fs.readFileSync(
 new URL('../scenarios/default-city.json',import.meta.url)
));

test('Waterfront details are deterministic and clear crossings',()=>{

 const city=createCityState(config);
 const parts=waterfrontParts(city);

 assert.deepEqual(parts,waterfrontParts(city));

 const {position,dimensions}=city.water;

 for(const p of parts){

  assert.ok(
   [p.width,p.height,p.depth]
    .every(n=>n>0&&Number.isFinite(n))
  );

  if(p.kind==='bridge-cap')continue;

  const x=Math.abs(p.x-position.x);

  assert.ok(
   x-p.width/2>=dimensions.width/2
  );

  assert.ok(
   x+p.width/2<=dimensions.width/2+29
  );

  assert.ok(
   Math.abs(p.z)+p.depth/2<=dimensions.depth/2
  );

  assert.ok(!city.roads.some(r=>
   Math.abs(p.x-r.position.x)<
    (p.width+r.dimensions.width)/2+5 &&
   Math.abs(p.z-r.position.z)<
    (p.depth+r.dimensions.depth)/2+5
  ));
 }

 for(const kind of [
  'rail','bench','lamp','lamp-head'
 ]){
  assert.ok(parts.some(p=>p.kind===kind));
 }

 assert.equal(
  parts.filter(p=>p.kind==='bridge-cap').length,
  city.bridges.length*2
 );
});
