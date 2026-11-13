import {

 terrainBlocksPath

} from './LandscapeEditor.js';


const clamp=(v,a,b)=>
 Math.max(a,Math.min(b,v));

const clone=o=>JSON.parse(
 JSON.stringify(o)
);

export const ROAD_WIDTHS=[10,14,20,28];

export function roadSegments(
 start,end,width=14,control=null
){

 const points=[start,end];

 if(control)points.push(control);

 if(!points.every(p=>

  Array.isArray(p)&&p.length===2&&

  p.every(Number.isFinite)

 ))throw Error('Invalid road coordinates');

 if(!ROAD_WIDTHS.includes(width))

  throw Error('Unsupported road width');

 const distance=Math.hypot(
  end[0]-start[0],
  end[1]-start[1]
 );

 if(distance<15)

  throw Error('Road must be at least 15 m');

 if(control&&Math.hypot(
  control[0]-start[0],
  control[1]-start[1]
 )<5)

  throw Error('Invalid curve control point');

 const estimate=control

  ?Math.hypot(
    control[0]-start[0],
    control[1]-start[1]
   )+
   Math.hypot(
    end[0]-control[0],
    end[1]-control[1]
   )

  :distance;

 const count=clamp(
  Math.ceil(estimate/15),
  1,200
 );

 const result=[];

 for(let i=0;i<=count;i++){

  const t=i/count;

  const q=1-t;

  if(control){

   result.push([

    q*q*start[0]+
    2*q*t*control[0]+
    t*t*end[0],

    q*q*start[1]+
    2*q*t*control[1]+
    t*t*end[1]
   ]);

  }else{

   result.push([

    start[0]+t*(end[0]-start[0]),

    start[1]+t*(end[1]-start[1])
   ]);
  }
 }

 return result;
}

export function pathBounds(points,width){

 const xs=points.map(p=>p[0]);
 const zs=points.map(p=>p[1]);

 const minX=Math.min(...xs)-width/2;
 const maxX=Math.max(...xs)+width/2;

 const minZ=Math.min(...zs)-width/2;
 const maxZ=Math.max(...zs)+width/2;

 return {

  position:{

   x:(minX+maxX)/2,

   y:2,

   z:(minZ+maxZ)/2
  },

  dimensions:{

   width:maxX-minX,

   depth:maxZ-minZ,

   height:1
  }
 };
}

export function pointSegmentDistance(p,a,b){

 const dx=b[0]-a[0];

 const dz=b[1]-a[1];

 const length=dx*dx+dz*dz;

 const t=length?clamp(

  (
   (p[0]-a[0])*dx+
   (p[1]-a[1])*dz
  )/length,

  0,1

 ):0;

 return Math.hypot(

  p[0]-a[0]-t*dx,

  p[1]-a[1]-t*dz
 );
}

function cross(a,b,c){

 return (b[0]-a[0])*(c[1]-a[1])-
        (b[1]-a[1])*(c[0]-a[0]);
}

function intersects(a,b,c,d){

 const x=cross(a,b,c);

 const y=cross(a,b,d);

 const z=cross(c,d,a);

 const w=cross(c,d,b);

 return x*y<0&&z*w<0;
}

export function segmentDistance(a,b,c,d){

 if(intersects(a,b,c,d))return 0;

 return Math.min(

  pointSegmentDistance(a,c,d),

  pointSegmentDistance(b,c,d),

  pointSegmentDistance(c,a,b),

  pointSegmentDistance(d,a,b)
 );
}

export function roadGeometry(road){

 if(road.path){

  return {

   points:road.path.points,

   width:road.path.width
  };
 }

 const {x,z}=road.position;

 const {width:w,depth:d}=
  road.dimensions;

 const vertical=road.axis==='z'||

  (!road.axis&&d>w);

 return {

  points:vertical

   ?[[x,z-d/2],[x,z+d/2]]

   :[[x-w/2,z],[x+w/2,z]],

  width:vertical?w:d
 };
}

export function roadsTouch(a,b){

 const A=roadGeometry(a);

 const B=roadGeometry(b);

 for(let i=1;i<A.points.length;i++){

  for(let j=1;j<B.points.length;j++){

   if(segmentDistance(

    A.points[i-1],A.points[i],

    B.points[j-1],B.points[j]

   )<=(A.width+B.width)/2+.01)

    return true;
  }
 }

 return false;
}

export function pathHitsObject(
 points,width,o,pad=0
){

 const {x,z}=o.position;

 const d=o.dimensions;

 const w=d.width/2+width/2+pad;

 const h=d.depth/2+width/2+pad;

 // Conservative rectangular footprint.

 const corners=[

  [x-w,z-h],

  [x+w,z-h],

  [x+w,z+h],

  [x-w,z+h]
 ];

 for(const p of points){

  if(Math.abs(p[0]-x)<=w&&
     Math.abs(p[1]-z)<=h)

   return true;
 }

 for(let i=1;i<points.length;i++){

  for(let j=0;j<4;j++){

   if(segmentDistance(

    points[i-1],points[i],

    corners[j],corners[(j+1)%4]

   )<.001)return true;
  }
 }

 return false;
}

export function makePathRoad(
 points,width,bridge=false
){

 return {

  id:'preview',

  type:'local',

  district:'New Development',

  ...pathBounds(points,width),

  axis:'path',

  orientation:0,

  visual:{color:'#697671'},

  path:{

   points:clone(points),

   width,

   bridge
  }
 };
}

export function validatePathRoad(
 state,road,oldId=null
){

 const path=road.path;

 if(!path||

    !Array.isArray(path.points)||

    path.points.length<2||

    path.points.length>201||

    !ROAD_WIDTHS.includes(path.width)||

    typeof path.bridge!=='boolean')

  return 'Invalid road geometry';

 if(!path.points.every(p=>

  Array.isArray(p)&&

  p.length===2&&

  p.every(Number.isFinite)

 ))return 'Invalid path coordinates';

 for(let i=1;i<path.points.length;i++){

  const a=path.points[i-1];

  const b=path.points[i];

  if(Math.hypot(
   b[0]-a[0],b[1]-a[1]
  )<.01)

   return 'Duplicate road points';
 }

 const half=state.boundary/2;

 for(const p of path.points){

  if(Math.abs(p[0])+path.width/2+6>half||

     Math.abs(p[1])+path.width/2+6>half)

   return 'Outside editable workspace';
 }

 if(terrainBlocksPath(

  state,path.points,path.width

 ))

  return 'Flatten terrain before drawing roads';

 const hitsWater=pathHitsObject(

  path.points,

  path.width,

  state.water,

  20
 );

 if(hitsWater&&!path.bridge)

  return 'Use Bridge to cross the river';

 if(path.bridge){

  const start=path.points[0];

  const end=path.points.at(-1);

  const cx=state.water.position.x;

  const margin=
   state.water.dimensions.width/2+40;

  if(!(

   (start[0]<cx-margin&&
    end[0]>cx+margin)||

   (end[0]<cx-margin&&
    start[0]>cx+margin)

  ))return 'Bridge must connect opposite banks';

 }

 for(const o of [

  ...state.buildings,

  ...state.parks
 ]){

  if(pathHitsObject(
   path.points,path.width,o,6
  ))

   return 'Road intersects a building or park';
 }

 const others=state.roads.filter(

  r=>r.id!==oldId
 );

 if(!others.some(
  r=>roadsTouch(road,r)
 ))

  return 'Connect to an existing road';

 // Reject effectively identical alignments.

 for(const r of others){

  if(!r.path)continue;

  const A=roadGeometry(r);

  const B=path.points;

  const near=p=>

   A.points.slice(1).some((q,i)=>

    pointSegmentDistance(

     p,A.points[i],q

    )<2
   );

  if(B.every(near))

   return 'Road already exists';
 }

 return null;
}

export function drawPath(
 model,start,end,width,control,bridge
){

 let road;

 try{

  const points=roadSegments(

   start,end,width,control
  );

  road=makePathRoad(

   points,width,bridge
  );

 }catch(error){

  return error.message;
 }

 const error=validatePathRoad(
  model.state,road
 );

 if(error)return error;

 model.checkpoint();

 road.id=model.nextId();

 model.state.roads.push(road);

 model.state.trees=
  model.state.trees.filter(t=>

   !pathHitsObject(

    road.path.points,width,

    {

     ...t,

     dimensions:{

      ...t.dimensions,

      width:t.dimensions.width*2,

      depth:t.dimensions.width*2
     }
    },

    5
   )
  );

 return null;
}

export function widenPath(
 model,id,width
){

 const found=model.find(id);

 if(!found||!found.object.path)

  return 'Select a drawn road';

 if(!ROAD_WIDTHS.includes(width))

  return 'Unsupported width';

 const previous=found.object;

 const next={

  ...previous,

  ...pathBounds(
   previous.path.points,width
  ),

  path:{

   ...previous.path,

   width
  }
 };

 const error=validatePathRoad(

  model.state,next,id
 );

 if(error)return error;

 const roads=model.state.roads.map(

  r=>r.id===id?next:r
 );

 if(!model.networkConnected(roads))

  return 'Network would disconnect';

 model.checkpoint();

 model.state.roads=roads;

 model.state.trees=
  model.state.trees.filter(t=>

   !pathHitsObject(
    next.path.points,width,t,8
   )
  );

 return null;
}
