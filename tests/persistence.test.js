
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {createCityState}
 from '../src/core/CityState.js';

import {ConstructionModel}
 from '../src/core/ConstructionModel.js';

import {
 makeSave,
 validateSave,
 inventory,
 CityStorage
} from '../src/core/CityPersistence.js';

const config=JSON.parse(fs.readFileSync(
 new URL('../scenarios/default-city.json',
 import.meta.url)
));

function setup(){

 const state=createCityState(config);

 const model=new ConstructionModel(state);

 return {
  state,model,
  baseline:model.snapshot()
 };
}

function memoryStorage(){

 const data=new Map();

 return {
  getItem:key=>data.get(key)??null,
  setItem:(key,value)=>data.set(key,value)
 };
}

test('City saves preserve construction decisions',()=>{

 const {state,model,baseline}=setup();

 model.upgrade(state.buildings[0].id);

 model.demolish(state.buildings[1].id);

 const save=makeSave(state,model);

 const restored=validateSave(
  JSON.parse(JSON.stringify(save)),
  baseline
 );

 assert.deepEqual(
  restored.state,
  model.snapshot()
 );

 assert.equal(
  restored.state.buildings.length,131
 );
});

test('Autosave survives storage reload',()=>{

 const {state,model}=setup();

 const backend=memoryStorage();

 const storage=new CityStorage(backend);

 const save=makeSave(state,model);

 storage.autosave(save);

 const reopened=new CityStorage(backend);

 assert.deepEqual(
  reopened.read().autosave,save
 );
});

test('Named city snapshots remain independent',()=>{

 const {state,model}=setup();

 const storage=new CityStorage(
  memoryStorage()
 );

 const a=makeSave(state,model,[],'Original');

 const id=storage.saveNamed(a);

 model.demolish(state.buildings[0].id);

 const b=makeSave(state,model,[],'Modified');

 storage.saveNamed(b);

 const saves=storage.read().snapshots;

 assert.equal(saves.length,2);

 assert.equal(
  saves[0].save.state.buildings.length,132
 );

 assert.equal(
  saves[1].save.state.buildings.length,131
 );

 storage.deleteNamed(id);

 assert.equal(
  storage.read().snapshots.length,1
 );
});

test('Invalid and incompatible saves are rejected',()=>{

 const {state,model,baseline}=setup();

 const save=makeSave(state,model);

 assert.throws(()=>validateSave(
  {...save,schemaVersion:999},
  baseline
 ));

 assert.throws(()=>validateSave(
  {...save,city:'Another city'},
  baseline
 ));

 save.state.buildings.push(
  save.state.buildings[0]
 );

 assert.throws(()=>validateSave(
  save,baseline
 ));
});

test('Imported saves protect original roads',()=>{

 const {state,model,baseline}=setup();

 const save=makeSave(state,model);

 save.state.roads.pop();

 assert.throws(()=>validateSave(
  save,baseline
 ));
});

test('Infrastructure inventory updates after decisions',()=>{

 const {state,model}=setup();

 const before=inventory(state);

 assert.equal(before.buildings,132);
 assert.equal(before.roads,19);
 assert.equal(before.bridges,7);
 assert.equal(before.parks,2);

 model.demolish(state.buildings[0].id);

 const after=inventory(state);

 assert.equal(after.buildings,131);

 assert.ok(
  after.estimatedFloorArea<
  before.estimatedFloorArea
 );

 assert.equal(
  after.parkArea,before.parkArea
 );
});

test('Save and load preserve persistent construction IDs',()=>{

 const {state,model,baseline}=setup();

 model.sequence=100;

 const save=makeSave(
  state,model,
  [{
   action:'upgrade',
   time:new Date().toISOString()
  }]
 );

 const restored=validateSave(
  save,baseline
 );

 assert.equal(restored.sequence,100);

 assert.equal(restored.history.length,1);

 assert.equal(
  restored.history[0].action,'upgrade'
 );
});
