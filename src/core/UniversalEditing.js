import {

 terrainBlocksObject

} from './LandscapeEditor.js';

import {
 pathHitsObject
} from './RoadPaths.js';

export const WORLD_SIZES=[2400,3600];

export function resizeWorld(state,size){

 if(![1200,...WORLD_SIZES].includes(size))

  throw Error('Unsupported workspace size');

 state.boundary=size;

 state.terrain.dimensions.width=size;

 state.terrain.dimensions.depth=size;

 state.water.dimensions.depth=size;
}

export function boundsFor(o){

 const d=o.dimensions;

 if(o.type==='tree'){

  return {

   ...o,

   dimensions:{

    ...d,

    width:d.width*2,

    depth:d.width*2
   }
  };
 }

 return o;
}

function overlap(a,b,pad=0){

 const A=boundsFor(a);
 const B=boundsFor(b);

 return (

  Math.abs(
   A.position.x-B.position.x
  )<(
   A.dimensions.width+
   B.dimensions.width
  )/2+pad

  &&

  Math.abs(
   A.position.z-B.position.z
  )<(
   A.dimensions.depth+
   B.dimensions.depth
  )/2+pad
 );
}

export function validateObjectEdit(
 state,key,o,oldId=null
){

 const {x,z}=o.position;

 const {width:w,depth:d,height:h}=
  o.dimensions;

 if(![x,z,w,d,h].every(Number.isFinite))

  return 'Invalid dimensions or position';

 if(w<=0||d<=0||h<=0)

  return 'Dimensions must be positive';

 if(terrainBlocksObject(state,o))

  return 'Flatten terrain before construction';

 const envelope=boundsFor(o);

 const half=state.boundary/2;

 if(

  Math.abs(x)+
   envelope.dimensions.width/2+6>half

  ||

  Math.abs(z)+
   envelope.dimensions.depth/2+6>half
 )

  return 'Outside editable workspace';

 if(overlap(o,state.water,32))

  return 'River and waterfront protected';

 if(key==='trees'){

  if(w<2||w>20||d!==w||
     h<4||h>50)

   return 'Invalid tree dimensions';

 }else if(key==='buildings'){

  if(w<12||d<12||
     w>180||d>180||
     h<8||h>180)

   return 'Building dimensions outside limits';

 }else if(key==='parks'){

  if(w<30||d<30||
     w>500||d>500)

   return 'Park dimensions outside limits';
 }

 if(state.buildings.some(
  b=>b.id!==oldId&&
     overlap(o,b,10)
 ))

  return 'Too close to another building';

 if(key!=='trees'&&state.parks.some(
  b=>b.id!==oldId&&
     overlap(o,b,8)
 ))

  return 'Overlaps a public park';

 if(key!=='roads'&&state.roads.some(
  b=>b.path

   ?pathHitsObject(
     b.path.points,b.path.width,o,10
    )

   :overlap(o,b,10)
 ))

  return 'Too close to a road';

 if(key==='trees'&&state.trees.some(
  b=>b.id!==oldId&&
     overlap(o,b,2)
 ))

  return 'Too close to another tree';

 return null;
}

export function modifyObject(
 model,id,changes
){

 const found=model.find(id);

 if(!found)
  return 'Object not found';

 const {key,object}=found;

 if(object.path)

  return 'Use road tools to edit this alignment';

 if(key==='roads'&&
    model.originalRoads.has(id))

  return 'Original roads are protected';

 const next=structuredClone(object);

 if(changes.x!==undefined)
  next.position.x=changes.x;

 if(changes.z!==undefined)
  next.position.z=changes.z;

 for(const field of [
  'width','depth','height'
 ]){

  if(changes[field]!==undefined)

   next.dimensions[field]=changes[field];
 }

 if(key==='trees')

  next.dimensions.depth=
   next.dimensions.width;

 if(changes.rotate){

  if(key!=='trees'){

   const d=next.dimensions;

   [d.width,d.depth]=[d.depth,d.width];

   next.orientation=(
    (next.orientation||0)+
    Math.PI/2
   )%(Math.PI*2);

   if(key==='roads')

    next.axis=
     next.axis==='z'?'x':'z';
  }
 }

 if(changes.color!==undefined){

  if(!/^#[0-9a-f]{6}$/i.test(
   changes.color
  ))

   return 'Invalid colour';

  next.visual.color=changes.color;
 }

 if(changes.district!==undefined)

  next.district=
   String(changes.district)
    .trim().slice(0,80)||
    'New Development';

 if(key==='parks'||key==='roads')

  next.dimensions.height=
   object.dimensions.height;

 const error=validateObjectEdit(
  model.state,key,next,id
 );

 if(error)return error;

 if(key==='roads'){

  const d=next.dimensions;

  const width=next.axis==='z'
   ?d.width:d.depth;

  const length=next.axis==='z'
   ?d.depth:d.width;

  if(width<10||width>40||
     length<20||length>500)

   return 'Invalid road dimensions';

  const other=model.state.roads.filter(
   r=>r.id!==id
  );

  if(other.some(r=>

   overlap(next,r)&&
   (r.axis??(
    r.dimensions.width<
    r.dimensions.depth?'z':'x'
   ))===next.axis
  ))

   return 'Overlapping parallel road';

  const roads=[...other,next];

  if(!model.networkConnected(roads))

   return 'Road network would disconnect';
 }

 model.checkpoint();

 model.state[key]=model.state[key].map(

  o=>o.id===id?next:o
 );

 if(key!=='trees')

  model.state.trees=
   model.state.trees.filter(
    t=>!overlap(next,t,5)
   );

 return null;
}

export function copyObject(
 model,id,x,z
){

 const found=model.find(id);

 if(!found)
  return 'Object not found';

 const {key,object}=found;

 if(key==='roads')

  return 'Use road construction instead';

 const next=structuredClone(object);

 next.position.x=x;

 next.position.z=z;

 const error=validateObjectEdit(
  model.state,key,next
 );

 if(error)return error;

 model.checkpoint();

 next.id=model.nextId();

 model.state[key].push(next);

 if(key!=='trees')

  model.state.trees=
   model.state.trees.filter(
    t=>!overlap(next,t,5)
   );

 return null;
}
