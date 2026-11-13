
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';

import {createCityState}
 from '../src/core/CityState.js';

import {
 streetLamps,activityRoutes,
 routeLength,routePosition
} from '../src/generators/StreetLife.js';

import {UrbanActivity}
 from '../src/renderer/UrbanActivity.js';

const config=JSON.parse(fs.readFileSync(
 new URL('../scenarios/default-city.json',import.meta.url)
));

test('Streetlights are deterministic and clear roads',()=>{

 for(let seed=0;seed<30;seed++){

  const s=createCityState({...config,seed});
  const lamps=streetLamps(s);

  assert.ok(lamps.length>100);
  assert.deepEqual(lamps,streetLamps(s));

  for(const l of lamps){

   assert.ok(!s.roads.some(r=>
    Math.abs(l.x-r.position.x)<
     r.dimensions.width/2 &&
    Math.abs(l.z-r.position.z)<
     r.dimensions.depth/2
   ));
  }
 }
});

test('Vehicle routes remain inside the road network',()=>{

 const s=createCityState(config);
 const {cars}=activityRoutes(s);

 assert.ok(cars.length>0);

 for(const route of cars){

  const length=routeLength(route);

  for(let d=0;d<length;d+=2){

   const p=routePosition(route,d);

   assert.ok(s.roads.some(r=>
    Math.abs(p.x-r.position.x)<=
     r.dimensions.width/2 &&
    Math.abs(p.z-r.position.z)<=
     r.dimensions.depth/2
   ));
  }

  assert.deepEqual(
   routePosition(route,0),
   routePosition(route,length)
  );
 }
});

test('Pedestrian routes remain inside public parks',()=>{

 const s=createCityState(config);
 const {walkers}=activityRoutes(s);

 assert.ok(walkers.length>0);

 for(const route of walkers){

  for(let d=0;d<routeLength(route);d+=1){

   const p=routePosition(route,d);

   assert.ok(s.parks.some(q=>
    Math.abs(p.x-q.position.x)<
     q.dimensions.width/2 &&
    Math.abs(p.z-q.position.z)<
     q.dimensions.depth/2
   ));
  }
 }
});

test('Activity controls and night lighting work',()=>{

 const view={
  state:createCityState(config),
  scene:new THREE.Scene(),
  geometries:{
   box:new THREE.BoxGeometry(1,1,1),
   sphere:new THREE.IcosahedronGeometry(1,1)
  }
 };

 const activity=new UrbanActivity(view);

 assert.equal(activity.carBodies.count,30);
 assert.equal(activity.peopleBodies.count,24);

 activity.setLevel('high');

 assert.equal(activity.carBodies.count,60);
 assert.equal(activity.peopleBodies.count,40);

 activity.setNight(true);
 assert.equal(activity.pools.visible,true);

 activity.setNight(false);
 assert.equal(activity.pools.visible,false);

 activity.setLevel('off');
 assert.equal(activity.carBodies.count,0);
 assert.equal(activity.update(1),false);

 activity.setLevel('low');
 assert.equal(activity.update(1),true);

 activity.paused=true;
 assert.equal(activity.update(1),false);

 activity.dispose();

 assert.equal(view.scene.children.length,0);

 view.geometries.box.dispose();
 view.geometries.sphere.dispose();
});
