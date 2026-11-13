import {
 ASSETS
} from './AssetLibrary.js';

import {
 groupEdit
} from './SpatialEditing.js';

import {

 applyLandscape,

 terrainBlocksObject

} from './LandscapeEditor.js';

import {

 roadsTouch,

 pathHitsObject,

 drawPath,

 widenPath

} from './RoadPaths.js';

import {

 resizeWorld,

 validateObjectEdit,

 modifyObject,

 copyObject

} from './UniversalEditing.js';


export const CATALOG = {
 ...ASSETS,
 house:      [30,32,14,'#ead6b4'],
 apartment:  [32,34,30,'#d8d7bc'],
 commercial: [34,36,24,'#d5c5af'],
 office:     [34,36,84,'#8faeb0'],
 hospital:   [38,38,30,'#e2dfcc'],
 school:     [36,38,18,'#ede4d3'],
 civic:      [36,38,28,'#e8dfca'],
 park:       [60,60,1,'#96b77d'],
 tree:       [8,8,18,'#577c54'],
 road:       [60,14,1,'#697671']
};

const clone = o => JSON.parse(JSON.stringify(o));

export const snap = n => Math.round(n/5)*5;

export function overlaps(a,b,pad=0){

 return Math.abs(a.position.x-b.position.x) <
  (a.dimensions.width+b.dimensions.width)/2+pad
 &&
 Math.abs(a.position.z-b.position.z) <
  (a.dimensions.depth+b.dimensions.depth)/2+pad;
}

export function touches(a,b){

 const dx=Math.abs(a.position.x-b.position.x);
 const dz=Math.abs(a.position.z-b.position.z);

 const w=(a.dimensions.width+b.dimensions.width)/2;
 const d=(a.dimensions.depth+b.dimensions.depth)/2;

 return (
  dx<=w+.01 &&
  dz<=d+.01 &&
  (dx<w-.01||dz<d-.01)
 );
}

export const roadAxis = r =>
 r.axis ?? (
  r.dimensions.width<r.dimensions.depth?'z':'x'
 );

export function roadsConnected(roads){

 if(!roads.length)return false;

 const seen=new Set([0]);
 const queue=[0];

 while(queue.length){

  const i=queue.shift();

  roads.forEach((r,j)=>{

   if(!seen.has(j)&&roadsTouch(roads[i],r)){

    seen.add(j);
    queue.push(j);
   }
  });
 }

 return seen.size===roads.length;
}

export function candidate(
 type,x,z,vertical=false,length=60
){

 if(!Object.hasOwn(CATALOG,type))
  throw new Error('Unknown construction tool');

 let [width,depth,height,color]=CATALOG[type];

 if(type==='road'){

  width=[40,60,100].includes(length)
   ?length:60;

  if(vertical)
   [width,depth]=[depth,width];
 }

 return {
  id:'preview',
  type:type==='road'?'local':type,
  district:'New Development',
  position:{x:snap(x),y:2,z:snap(z)},
  dimensions:{width,depth,height},
  orientation:0,

  ...(type==='road'
   ?{axis:vertical?'z':'x'}:{}),

  visual:{
   color,
   roof:'#76877e',
   roofForm:type==='house'?'gable':'flat'
  }
 };
}

export function validatePlacement(state,type,o){

 const {x,z}=o.position;
 const {width:w,depth:d}=o.dimensions;

 if(![x,z,w,d].every(Number.isFinite))
  return 'Invalid coordinates';

 if(terrainBlocksObject(state,o))

  return 'Flatten terrain before construction';

 if(type==='tree')

  return validateObjectEdit(
   state,'trees',o
  );

 const half=state.boundary/2;

 if(Math.abs(x)+w/2+6>half||
    Math.abs(z)+d/2+6>half)
  return 'Outside city boundary';

 if(overlaps(o,state.water,32))
  return 'River and waterfront protected';

 if(state.buildings.some(
  b=>overlaps(o,b,10)
 ))
  return 'Too close to an existing building';

 if(state.parks.some(
  p=>overlaps(o,p,8)
 ))
  return 'Too close to a public park';

 if(type==='road'){

  if(!state.roads.some(
   r=>roadsTouch(o,r)
  ))
   return 'Connect road to existing network';

  if(state.roads.some(r=>
   overlaps(o,r)&&
   roadAxis(o)===roadAxis(r)
  ))
   return 'Overlapping parallel road';

 }else if(state.roads.some(
  r=>r.path

   ?pathHitsObject(
     r.path.points,r.path.width,o,12
    )

   :overlaps(o,r,12)
 )){

  return 'Too close to an existing road';
 }

 return null;
}

export class ConstructionModel{

 constructor(state){

  this.state=state;

  this.originalRoads=new Set(
   state.roads.map(r=>r.id)
  );

  this.undoStack=[];
  this.redoStack=[];
  this.sequence=1;
 }

 snapshot(){

  const {buildings,parks,roads,trees}=this.state;

  return clone({
   buildings,parks,roads,trees,
   boundary:this.state.boundary,

   landscape:this.state.landscape??{}
  });
 }

 restore(data){

  const snapshot=clone(data);

  const size=snapshot.boundary??
   this.state.boundary;

  delete snapshot.boundary;

  this.state.landscape={};

  Object.assign(this.state,snapshot);

  resizeWorld(this.state,size);
 }

 checkpoint(){

  this.undoStack.push(this.snapshot());

  if(this.undoStack.length>50)
   this.undoStack.shift();

  this.redoStack=[];
 }

 nextId(){

  const objects=[
   ...this.state.buildings,
   ...this.state.roads,
   ...this.state.parks,
   ...this.state.trees
  ];

  let id;

  do{
   id='constructed-'+this.sequence++;
  }while(objects.some(o=>o.id===id));

  return id;
 }

 place(type,x,z,vertical=false,length=60){

  const o=candidate(
   type,x,z,vertical,length
  );

  const reason=validatePlacement(
   this.state,type,o
  );

  if(reason)return reason;

  this.checkpoint();

  o.id=this.nextId();

  const key=type==='road'?'roads':
   type==='park'?'parks':
   type==='tree'?'trees':'buildings';

  this.state[key].push(o);

  // Existing tree canopies extend beyond
  // their recorded half-width.

  if(key!=='trees')
  this.state.trees=this.state.trees.filter(t=>{

   const canopy={
    ...t,
    dimensions:{
     ...t.dimensions,
     width:t.dimensions.width*2,
     depth:t.dimensions.width*2
    }
   };

   return !overlaps(o,canopy,5);
  });

  return null;
 }

 find(id){

  for(const key of ['buildings','parks','roads','trees']){

   const object=this.state[key].find(
    o=>o.id===id
   );

   if(object)return {key,object};
  }

  return null;
 }

 demolish(id){

  const result=this.find(id);

  if(!result)return 'No structure selected';

  const {key,object}=result;

  if(key==='roads'){

   if(this.originalRoads.has(id))
    return 'Original road network is protected';

   if(!object.path&&overlaps(object,this.state.water))
    return 'Bridge crossings are protected';

   const remaining=this.state.roads.filter(
    r=>r.id!==id
   );

   if(!roadsConnected(remaining))
    return 'Removal disconnects road network';
  }

  this.checkpoint();

  this.state[key]=this.state[key].filter(
   o=>o.id!==id
  );

  return null;
 }

 upgrade(id){

  const result=this.find(id);

  if(!result||result.key!=='buildings')
   return 'Select a building';

  const b=result.object;

  if(b.dimensions.height>=180)
   return 'Maximum height reached';

  this.checkpoint();

  b.dimensions.height=Math.min(
   180,b.dimensions.height+8
  );

  return null;
 }

 drawRoad(
  start,end,width=14,
  control=null,bridge=false
 ){

  return drawPath(

   this,start,end,width,control,bridge
  );
 }

 widenRoad(id,width){

  return widenPath(this,id,width);
 }

 edit(id,changes){

  return modifyObject(
   this,id,changes
  );
 }

 duplicate(id,x,z){

  return copyObject(
   this,id,x,z
  );
 }

 networkConnected(roads){

  return roadsConnected(roads);
 }

 groupEdit(ids,action,dx=0,dz=0){

  return groupEdit(this,ids,action,dx,dz);
 }

 landscapeBrush(tool,x,z,radius=40){

  return applyLandscape(

   this,tool,x,z,radius,

   candidate,validatePlacement
  );
 }

 expand(){

  const size=this.state.boundary;

  if(size>=3600)

   return 'Maximum workspace reached';

  this.checkpoint();

  resizeWorld(
   this.state,
   size<2400?2400:3600
  );

  return null;
 }

 undo(){

  if(!this.undoStack.length)return false;

  this.redoStack.push(this.snapshot());

  this.restore(this.undoStack.pop());

  return true;
 }

 redo(){

  if(!this.redoStack.length)return false;

  this.undoStack.push(this.snapshot());

  this.restore(this.redoStack.pop());

  return true;
 }
}
