import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createCityState} from '../src/core/CityState.js';
import {createBlocks} from '../src/generators/BlockLayout.js';
const config=JSON.parse(fs.readFileSync(new URL('../scenarios/westhaven.json',import.meta.url)));
const baseline=JSON.parse(fs.readFileSync(new URL('../scenarios/default-city.json',import.meta.url)));
const overlaps=(a,b,pad=0)=>Math.abs(a.position.x-b.position.x)<(a.dimensions.width+b.dimensions.width)/2+pad&&Math.abs(a.position.z-b.position.z)<(a.dimensions.depth+b.dimensions.depth)/2+pad;
test('configured blocks, parks and streets follow the scenario, not Riverbend constants',()=>{
 const city=createCityState(config), original=createCityState(baseline);
 assert.equal(createBlocks(config).length,24);assert.equal(city.parks.length,3);
 assert.notDeepEqual(city.roads,original.roads);assert.notEqual(city.buildings.length,original.buildings.length);
 assert.deepEqual(city,createCityState(config));
 assert.ok(city.buildings.some(b=>b.type==='hospital'));assert.ok(city.buildings.some(b=>b.type==='school'));
 assert.equal(new Set(city.buildings.map(b=>b.id)).size,city.buildings.length);
 for(const b of city.buildings) assert.ok(createBlocks(config).some(block=>!block.park&&block.district===b.district&&Math.abs(b.position.x-block.x)<block.width/2&&Math.abs(b.position.z-block.z)<block.depth/2));
});
test('configured layout clears roads, water, parks and building envelopes across 30 seeds',()=>{
 for(let seed=0;seed<30;seed++){
 const city=createCityState({...config,seed});
 for(const b of city.buildings){for(const o of [...city.roads,city.water,...city.parks])assert.ok(!overlaps(b,o,10),`${seed} ${b.id} ${o.id}`);assert.ok(Math.abs(b.position.x)+b.dimensions.width/2+8<600);assert.ok(Math.abs(b.position.z)+b.dimensions.depth/2+8<600);}
 for(let i=0;i<city.buildings.length;i++)for(let j=i+1;j<city.buildings.length;j++)assert.ok(!overlaps(city.buildings[i],city.buildings[j],8));
 for(const p of city.parks)for(const r of city.roads)assert.ok(!overlaps(p,r,8));
 }
});
test('configured roads remain connected and bridged',()=>{
 const s=createCityState(config),seen=new Set([0]);let changed=true;while(changed){changed=false;s.roads.forEach((r,i)=>{if(!seen.has(i)&&[...seen].some(j=>overlaps(r,s.roads[j]))){seen.add(i);changed=true;}});}assert.equal(seen.size,s.roads.length);
 for(const r of s.roads.filter(r=>overlaps(r,s.water)))assert.ok(s.bridges.some(b=>b.position.z===r.position.z&&b.dimensions.width>=s.water.dimensions.width));
});
test('invalid configurable layouts fail clearly',()=>{
 assert.throws(()=>createCityState({...config,roadCoordinates:[-540,-345,0,165,345,540]}),/riverside/);
 assert.throws(()=>createCityState({...config,layout:{...config.layout,districtGrid:[]}}),/District grid/);
 assert.throws(()=>createCityState({...config,layout:{...config.layout,parks:[[99,1]]}}),/Park coordinates/);
});
