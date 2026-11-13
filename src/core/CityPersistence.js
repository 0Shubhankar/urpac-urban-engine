import {
 ASSETS
} from './AssetLibrary.js';
import {

 validateLandscape

} from './LandscapeEditor.js';

import {

 pathBounds,

 roadGeometry,

 validatePathRoad

} from './RoadPaths.js';

import {validateSimulation}
 from './UrbanSimulation.js';

import {
 roadsConnected
} from './ConstructionModel.js';

export const SCHEMA_VERSION=1;

export const STORAGE_KEY=
 'urpac-uue-riverbend-v1';

const clone=o=>JSON.parse(JSON.stringify(o));

const collections=[
 'buildings','roads','parks','trees'
];

const same=(a,b)=>
 JSON.stringify(a)===JSON.stringify(b);

export function makeSave(
 state,model,history=[],name='Autosave'
){

 return {
  format:'URPAC Urban Engine',
  schemaVersion:SCHEMA_VERSION,
  city:'Riverbend',
  name:String(name).slice(0,80),
  savedAt:new Date().toISOString(),
  sequence:model.sequence,
  state:clone(model.snapshot()),
  history:clone(history)
 };
}

export function validateSave(save,baseline){

 const fail=message=>{
  throw new Error(message);
 };

 if(!save||typeof save!=='object')
  fail('Invalid save file');

 if(save.format!=='URPAC Urban Engine')
  fail('Not a UUE save file');

 if(save.schemaVersion!==SCHEMA_VERSION)
  fail('Unsupported save version');

 if(save.city!=='Riverbend')
  fail('Save belongs to another city');

 if(!Number.isSafeInteger(save.sequence)||
    save.sequence<1)
  fail('Invalid construction sequence');

 if(!save.state)
  fail('Missing city state');

 const ids=new Set();

 const state=save.state;

 const worldSize=state.boundary??2400;

 if(![1200,2400,3600].includes(worldSize))
  fail('Invalid workspace size');

 const knownTypes=new Set([

  ...Object.keys(ASSETS),
  ...baseline.buildings.map(b=>b.type),
  ...baseline.roads.map(b=>b.type),
  ...baseline.parks.map(b=>b.type),
  ...baseline.trees.map(b=>b.type),
  'house','apartment','commercial','office',
  'hospital','school','civic','park','local'
 ]);

 for(const key of collections){

  if(!Array.isArray(state[key]))
   fail('Missing collection: '+key);

  if(state[key].length>10000)
   fail('City exceeds supported size');

  for(const o of state[key]){

   if(!o||typeof o.id!=='string'||
      !o.id.length||ids.has(o.id))
    fail('Invalid or duplicate object ID');

   ids.add(o.id);

   if(!knownTypes.has(o.type))
    fail('Unknown object type');

   if(!o.position||!o.dimensions||
      !o.visual||typeof o.district!=='string')
    fail('Incomplete city object');

   const {x,y,z}=o.position;
   const {width,depth,height}=o.dimensions;

   if(![x,y,z,width,depth,height]
       .every(Number.isFinite))
    fail('Invalid object geometry');

   if(width<=0||depth<=0||height<=0)
    fail('Invalid object dimensions');

   if(

     Math.abs(x)+width/2>worldSize/2||

     Math.abs(z)+depth/2>worldSize/2

   )
    fail('Object outside Riverbend');

   if(key==='buildings'&&height>250)
    fail('Building exceeds supported height');
  }
 }

 // Original roads cannot be removed,
 // relocated or resized by imported saves.

 for(const road of baseline.roads){

  const restored=state.roads.find(
   r=>r.id===road.id
  );

  if(!restored||!same(road,restored))
   fail('Original road network modified');
 }

 for(const road of state.roads){

  if(!road.path)continue;

  const error=validatePathRoad(

   {

    ...state,

    boundary:worldSize,

    water:{

     position:{x:0,y:2,z:0},

     dimensions:{

      width:110,

      depth:worldSize,

      height:1
     }
    }
   },

   road,

   road.id
  );

  if(error)fail(error);

  const bounds=pathBounds(

   road.path.points,

   road.path.width
  );

  for(const key of ['width','depth']){

   if(Math.abs(

    road.dimensions[key]-

    bounds.dimensions[key]

   )>.001)

    fail('Invalid path bounds');
  }

  for(const key of ['x','z']){

   if(Math.abs(

    road.position[key]-

    bounds.position[key]

   )>.001)

    fail('Invalid path position');
  }
 }

 state.landscape=validateLandscape(

  state.landscape,

  {

   ...state,

   boundary:worldSize,

   bridges:[],

   water:{

    position:{x:0,y:2,z:0},

    dimensions:{

     width:110,

     depth:worldSize,

     height:1
    }
   }
  }
 );

 if(!roadsConnected(state.roads))
  fail('Disconnected road network');

 if(!Array.isArray(save.history)||
    save.history.length>10000)
  fail('Invalid decision history');

 for(const entry of save.history){

  if(!entry||
     typeof entry.action!=='string'||
     typeof entry.time!=='string')
   fail('Invalid decision record');
 }

 const result=clone(save);

 if(result.simulation!=null){

  result.simulation=
   validateSimulation(result.simulation);
 }

 return result;
}

export function inventory(state){

 const types={};

 let floorArea=0;
 let parkArea=0;
 let roadLength=0;

 for(const b of state.buildings){

  types[b.type]=(types[b.type]||0)+1;

  const {width,depth,height}=b.dimensions;

  floorArea+=
   width*depth*Math.max(
    1,Math.floor(height/3.2)
   );
 }

 for(const p of state.parks){

  parkArea+=
   p.dimensions.width*
   p.dimensions.depth;
 }

 for(const r of state.roads){

  if(r.path){

   const {points}=roadGeometry(r);

   for(let i=1;i<points.length;i++){

    roadLength+=Math.hypot(

     points[i][0]-points[i-1][0],

     points[i][1]-points[i-1][1]
    );
   }

  }else{

   roadLength+=Math.max(

    r.dimensions.width,

    r.dimensions.depth
   );
  }
 }

 return {
  buildings:state.buildings.length,
  roads:state.roads.length,
  bridges:state.bridges.length,
  parks:state.parks.length,
  trees:state.trees.length,
  types,
  estimatedFloorArea:Math.round(floorArea),
  parkArea:Math.round(parkArea),
  estimatedRoadLength:Math.round(roadLength)
 };
}

export class CityStorage{

 constructor(storage){

  this.storage=storage;
 }

 read(){

  const raw=this.storage.getItem(
   STORAGE_KEY
  );

  if(!raw)return {
   autosave:null,
   snapshots:[]
  };

  const data=JSON.parse(raw);

  if(!Array.isArray(data.snapshots))
   throw new Error('Invalid storage data');

  return data;
 }

 write(data){

  this.storage.setItem(
   STORAGE_KEY,
   JSON.stringify(data)
  );
 }

 autosave(save){

  const data=this.read();

  data.autosave=save;

  this.write(data);
 }

 saveNamed(save){

  const data=this.read();

  const id=
   Date.now().toString(36)+'-'+
   Math.random().toString(36).slice(2,8);

  data.snapshots.push({
   id,
   save
  });

  this.write(data);

  return id;
 }

 deleteNamed(id){

  const data=this.read();

  data.snapshots=data.snapshots.filter(
   s=>s.id!==id
  );

  this.write(data);
 }
}
