
export const DEFAULTS=Object.freeze({

 floorHeight:3.2,
 usableShare:.8,

 residentialSpace:40,
 officeSpace:25,
 commercialSpace:40,
 publicJobSpace:60,

 initialOccupancy:.75,

 labourShare:.55,
 schoolShare:.18,

 greenTarget:10,

 migrationRate:.01,
 birthRate:.012,
 deathRate:.008,

 healthSpace:12,
 schoolSpace:10,

 accessDistance:100,
 parkDistance:250
});

const clamp=(x,a,b)=>
 Math.max(a,Math.min(b,x));

export function assumptions(raw={}){

 const p={...DEFAULTS};

 for(const k of Object.keys(p)){

  if(Object.hasOwn(raw,k)){

   const v=raw[k];

   if(typeof v!=='number'||
      !Number.isFinite(v)||
      v<0||v>1000000)

    throw Error('Invalid assumption: '+k);

   p[k]=v;
  }
 }

 const positive=[
  'floorHeight',
  'residentialSpace',
  'officeSpace',
  'commercialSpace',
  'publicJobSpace',
  'greenTarget',
  'healthSpace',
  'schoolSpace',
  'accessDistance',
  'parkDistance'
 ];

 for(const k of positive){

  if(p[k]<.01)

   throw Error(
    'Positive value required: '+k
   );
 }

 const fractions=[
  'usableShare',
  'initialOccupancy',
  'labourShare',
  'schoolShare',
  'migrationRate',
  'birthRate',
  'deathRate'
 ];

 for(const k of fractions){

  if(p[k]>1)

   throw Error(
    'Fraction exceeds one: '+k
   );
 }

 return p;
}

function distance(a,b){

 return Math.hypot(

  Math.max(
   0,
   Math.abs(
    a.position.x-b.position.x
   )-b.dimensions.width/2
  ),

  Math.max(
   0,
   Math.abs(
    a.position.z-b.position.z
   )-b.dimensions.depth/2
  )
 );
}

const nearest=(a,objects)=>

 objects.reduce(
  (best,b)=>
   Math.min(best,distance(a,b)),
  Infinity
 );

const ratio=(a,b)=>b>0?a/b:1;

export function capacity(state,p){

 let housing=0;
 let jobs=0;
 let health=0;
 let school=0;
 let green=0;

 let access=0;
 let value=0;
 let weight=0;

 const spatial=[];

 for(const b of state.buildings){

  const d=b.dimensions;

  const floors=Math.max(
   1,
   Math.floor(d.height/p.floorHeight)
  );

  const area=
   d.width*d.depth*
   floors*p.usableShare;

  const residential=[
   'house',
   'apartment',
   'midrise'
  ].includes(b.type);

  if(residential){

   housing+=area/p.residentialSpace;

  }else if(b.type==='office'){

   jobs+=area/p.officeSpace;

  }else if(b.type==='commercial'){

   jobs+=area/p.commercialSpace;

  }else{

   jobs+=area/p.publicJobSpace;
  }

  if(b.type==='hospital')

   health+=area/p.healthSpace;

  if(b.type==='school')

   school+=area/p.schoolSpace;

  // Spatial proximity indices.
  // These are not measured travel times.

  const road=Math.exp(
   -nearest(b,state.roads)/
   p.accessDistance
  );

  const park=Math.exp(
   -nearest(b,state.parks)/
   p.parkDistance
  );

  // Relative land-value proxy.
  // Index only, not a monetary valuation.

  const index=100*(
   .5+.35*road+.15*park
  );

  spatial.push({

   id:b.id,

   accessibility:road,

   landValueIndex:index
  });

  if(residential){

   access+=road*area;

   value+=index*area;

   weight+=area;
  }
 }

 for(const park of state.parks){

  green+=park.dimensions.width*
         park.dimensions.depth;
 }

 return {

  housing:Math.floor(housing),

  jobs:Math.floor(jobs),

  health:Math.floor(health),

  school:Math.floor(school),

  green,

  access:weight?access/weight:0,

  value:weight?value/weight:0,

  spatial
 };
}

export function initialSimulation(
 state,raw={}
){

 const p=assumptions(raw);

 return {

  month:0,

  population:Math.round(
   capacity(state,p).housing*
   p.initialOccupancy
  ),

  parameters:p,

  last:{

   births:0,

   deaths:0,

   migration:0
  }
 };
}

export function validateSimulation(raw){

 if(!raw||
    !Number.isSafeInteger(raw.month)||
    raw.month<0||
    raw.month>120000||
    !Number.isFinite(raw.population)||
    raw.population<0||
    raw.population>1e9)

  throw Error('Invalid simulation state');

 const last=raw.last??{

  births:0,
  deaths:0,
  migration:0
 };

 for(const k of [
  'births','deaths','migration'
 ]){

  if(!Number.isFinite(last[k])||
     Math.abs(last[k])>1e9)

   throw Error('Invalid population flow');
 }

 if(last.births<0||last.deaths<0)

  throw Error('Invalid birth or death count');

 return {

  month:raw.month,

  population:raw.population,

  parameters:assumptions(
   raw.parameters??{}
  ),

  last:{

   births:last.births,

   deaths:last.deaths,

   migration:last.migration
  }
 };
}

export function metrics(state,sim){

 const p=sim.parameters;

 const c=capacity(state,p);

 const n=sim.population;

 const labour=n*p.labourShare;

 const employed=Math.min(
  labour,c.jobs
 );

 return {

  ...c,

  population:n,

  labour,

  employed,

  unemployment:
   labour?1-employed/labour:0,

  occupancy:
   c.housing?n/c.housing:0,

  housingShortage:
   Math.max(0,n-c.housing),

  vacantCapacity:
   Math.max(0,c.housing-n),

  healthAdequacy:
   clamp(ratio(c.health,n),0,1),

  schoolAdequacy:
   clamp(
    ratio(c.school,n*p.schoolShare),
    0,1
   ),

  greenAdequacy:
   clamp(
    ratio(c.green,n*p.greenTarget),
    0,1
   ),

  greenPerResident:
   n?c.green/n:0
 };
}

export function step(state,sim){

 const p=sim.parameters;

 const m=metrics(state,sim);

 const n=sim.population;

 const births=n*p.birthRate/12;

 const deaths=n*p.deathRate/12;

 // Public-service adequacy modifies
 // the attractiveness of the city.

 const serviceFactor=.6+.4*(
  m.healthAdequacy+
  m.schoolAdequacy+
  m.greenAdequacy
 )/3;

 const target=Math.min(

  m.housing,

  p.labourShare>0
   ?m.jobs/p.labourShare
   :m.housing

 )*serviceFactor;

 // Monthly migration is bounded.

 const limit=
  Math.max(1,n)*p.migrationRate;

 const migration=clamp(
  (target-n)*.1,
  -limit,
  limit
 );

 return {

  ...sim,

  month:sim.month+1,

  population:Math.max(
   0,
   n+births-deaths+migration
  ),

  last:{

   births,

   deaths,

   migration
  }
 };
}

export class UrbanSimulation{

 constructor(state){

  this.state=state;

  this.data=initialSimulation(state);
 }

 getMetrics(){

  return metrics(
   this.state,this.data
  );
 }

 advance(months=1){

  if(!Number.isInteger(months)||
     months<1||months>1200)

   throw Error('Invalid month count');

  for(let i=0;i<months;i++){

   if(this.data.month>=120000)

    throw Error('Simulation limit reached');

   this.data=step(
    this.state,
    this.data
   );
  }

  return this.getMetrics();
 }

 setParameters(parameters){

  this.data.parameters=assumptions({

   ...this.data.parameters,

   ...parameters
  });
 }

 snapshot(){

  return JSON.parse(
   JSON.stringify(this.data)
  );
 }

 restore(data){

  this.data=data
   ?validateSimulation(data)
   :initialSimulation(this.state);
 }
}
