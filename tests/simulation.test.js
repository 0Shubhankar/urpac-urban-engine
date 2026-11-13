
import test from 'node:test';

import assert from 'node:assert/strict';

import fs from 'node:fs';

import {createCityState}
 from '../src/core/CityState.js';

import {ConstructionModel}
 from '../src/core/ConstructionModel.js';

import {
 assumptions,
 initialSimulation,
 metrics,
 step,
 validateSimulation,
 UrbanSimulation
} from '../src/core/UrbanSimulation.js';

import {
 makeSave,
 validateSave
} from '../src/core/CityPersistence.js';

const config=JSON.parse(fs.readFileSync(

 new URL(
  '../scenarios/default-city.json',
  import.meta.url
 )

));

const setup=()=>createCityState(config);

test('Initial urban simulation is deterministic',()=>{

 const state=setup();

 const a=initialSimulation(state);

 const b=initialSimulation(state);

 assert.deepEqual(a,b);

 const m=metrics(state,a);

 assert.ok(m.housing>0);

 assert.ok(m.jobs>0);

 assert.ok(a.population>0);

 assert.equal(
  a.population,
  Math.round(m.housing*.75)
 );
});

test('Population changes conserve population flows',()=>{

 const s=setup();

 let a=initialSimulation(s);

 for(let i=0;i<120;i++){

  const before=a.population;

  a=step(s,a);

  const expected=Math.max(
   0,before+
   a.last.births-
   a.last.deaths+
   a.last.migration
  );

  assert.ok(
   Math.abs(
    a.population-expected
   )<.000001
  );

  assert.ok(
   Number.isFinite(a.population)
  );
 }

 assert.equal(a.month,120);
});

test('Residential construction increases housing capacity',()=>{

 const s=setup();

 const sim=initialSimulation(s);

 const before=metrics(s,sim);

 s.buildings.push({

  id:'test-residence',

  type:'apartment',

  position:{x:200,y:2,z:200},

  dimensions:{
   width:30,
   depth:30,
   height:30
  }
 });

 const after=metrics(s,sim);

 assert.ok(
  after.housing>before.housing
 );

 assert.equal(
  after.population,
  before.population
 );
});

test('Office construction increases job capacity',()=>{

 const s=setup();

 const sim=initialSimulation(s);

 const before=metrics(s,sim);

 s.buildings.push({

  id:'test-office',

  type:'office',

  position:{x:200,y:2,z:200},

  dimensions:{
   width:35,
   depth:35,
   height:80
  }
 });

 const after=metrics(s,sim);

 assert.ok(
  after.jobs>before.jobs
 );

 assert.equal(
  after.housing,
  before.housing
 );
});

test('Public infrastructure changes service adequacy',()=>{

 const s=setup();

 const sim=initialSimulation(s);

 const before=metrics(s,sim);

 s.buildings.push({

  id:'test-hospital',

  type:'hospital',

  position:{x:200,y:2,z:200},

  dimensions:{
   width:40,
   depth:40,
   height:30
  }
 });

 const after=metrics(s,sim);

 assert.ok(
  after.health>before.health
 );

 assert.ok(
  after.healthAdequacy>=
  before.healthAdequacy
 );
});

test('Spatial indices remain within defined bounds',()=>{

 const s=setup();

 const m=metrics(
  s,
  initialSimulation(s)
 );

 for(const b of m.spatial){

  assert.ok(
   b.accessibility>=0&&
   b.accessibility<=1
  );

  assert.ok(
   b.landValueIndex>=50&&
   b.landValueIndex<=100
  );
 }
});

test('Invalid assumptions are rejected',()=>{

 assert.throws(()=>assumptions({

  residentialSpace:0
 }));

 assert.throws(()=>assumptions({

  labourShare:1.5
 }));

 assert.throws(()=>assumptions({

  migrationRate:-.1
 }));

 assert.throws(()=>validateSimulation({

  month:-1,

  population:100
 }));
});

test('Simulation handles an empty city',()=>{

 const s=setup();

 s.buildings=[];
 s.parks=[];
 s.roads=[];

 const sim=initialSimulation(s);

 assert.equal(sim.population,0);

 const m=metrics(s,sim);

 assert.equal(m.housing,0);

 assert.equal(m.jobs,0);

 assert.equal(m.access,0);

 assert.equal(m.value,0);

 assert.equal(
  step(s,sim).population,0
 );
});

test('Simulation state survives save and load',()=>{

 const s=setup();

 const construction=
  new ConstructionModel(s);

 const baseline=
  construction.snapshot();

 const sim=new UrbanSimulation(s);

 sim.advance(24);

 sim.setParameters({

  residentialSpace:50
 });

 const save=makeSave(
  s,construction
 );

 save.simulation=sim.snapshot();

 const imported=validateSave(

  JSON.parse(JSON.stringify(save)),

  baseline
 );

 const restored=
  new UrbanSimulation(s);

 restored.restore(
  imported.simulation
 );

 assert.deepEqual(

  restored.snapshot(),

  sim.snapshot()
 );

 assert.equal(
  restored.data.month,24
 );

 assert.equal(
  restored.data.parameters
   .residentialSpace,50
 );
});

test('Older saves remain compatible',()=>{

 const s=setup();

 const model=
  new ConstructionModel(s);

 const save=makeSave(s,model);

 const restored=validateSave(
  save,model.snapshot()
 );

 const sim=new UrbanSimulation(s);

 sim.restore(
  restored.simulation??null
 );

 assert.equal(
  sim.data.month,0
 );

 assert.ok(
  sim.data.population>0
 );
});
