
import {

 validateObjectEdit,

 boundsFor

} from './UniversalEditing.js';

export function groupEdit(
 model,ids,action,dx=0,dz=0
){

 if(!['move','delete'].includes(action))

  return 'Unknown group action';

 const unique=[...new Set(ids)];

 if(!unique.length)

  return 'Select objects first';

 if(![dx,dz].every(Number.isFinite))

  return 'Invalid displacement';

 const items=unique.map(id=>model.find(id));

 if(items.some(item=>

  !item||item.key==='roads'

 ))return 'Group editing supports buildings, parks and trees';

 const selected=new Set(unique);

 const staged={

  ...model.state
 };

 for(const key of [

  'buildings','parks','trees'

 ]){

  staged[key]=model.state[key].filter(

   o=>!selected.has(o.id)
  );
 }

 if(action==='move'){

  for(const {key,object} of items){

   const next=structuredClone(object);

   next.position.x+=dx;

   next.position.z+=dz;

   const error=validateObjectEdit(

    staged,key,next
   );

   if(error)return error;

   staged[key].push(next);
  }
 }

 model.checkpoint();

 for(const key of [

  'buildings','parks','trees'

 ]){

  model.state[key]=staged[key];
 }

 return null;
}

export function measureDistance(points){

 let distance=0;

 for(let i=1;i<points.length;i++){

  distance+=Math.hypot(

   points[i][0]-points[i-1][0],

   points[i][1]-points[i-1][1]
  );
 }

 return distance;
}

export function measureArea(points){

 if(points.length<3)return 0;

 let area=0;

 for(let i=0;i<points.length;i++){

  const a=points[i];

  const b=points[(i+1)%points.length];

  area+=a[0]*b[1]-b[0]*a[1];
 }

 return Math.abs(area)/2;
}

export function visibleState(state,layers){

 const result={...state};

 for(const key of [

  'buildings','roads','bridges',

  'parks','trees'

 ]){

  if(layers[key]===false)

   result[key]=[];
 }

 if(layers.parcels===false){

  result.landscape=Object.fromEntries(

   Object.entries(
    state.landscape??{}
   ).map(([key,value])=>[

    key,

    {...value,parcel:null}
   ])
  );
 }

 return result;
}
