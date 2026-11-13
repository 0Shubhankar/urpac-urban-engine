
import {
 pathHitsObject
} from './RoadPaths.js';

export const CELL=40;

export const LAND_COLORS={

 residential:'#a7c59b',

 commercial:'#a0b7c7',

 public:'#d2c49b'
};

export const LAND_TOOLS=[

 'raise-land',

 'lower-land',

 'flatten-land',

 'pond',

 'paint-trees',

 'clear-trees',

 'residential-land',

 'commercial-land',

 'public-land',

 'clear-parcel'
];

const clone=o=>
 JSON.parse(JSON.stringify(o));

export function cellKey(x,z){

 return Math.floor(x/CELL)+
  ':'+Math.floor(z/CELL);
}

export function cellPosition(key){

 const [x,z]=key.split(':').map(Number);

 return {

  x:x*CELL+CELL/2,

  z:z*CELL+CELL/2
 };
}

export function getCell(state,key){

 return state.landscape?.[key]??{

  height:0,

  pond:false,

  parcel:null
 };
}

export function cellObject(key){

 const {x,z}=cellPosition(key);

 return {

  position:{x,y:2,z},

  dimensions:{

   width:CELL,

   depth:CELL,

   height:1
  }
 };
}

function overlap(a,b,pad=0){

 return (

  Math.abs(
   a.position.x-b.position.x
  )<

  (
   a.dimensions.width+
   b.dimensions.width
  )/2+pad

  &&

  Math.abs(
   a.position.z-b.position.z
  )<

  (
   a.dimensions.depth+
   b.dimensions.depth
  )/2+pad
 );
}

export function brushCells(
 state,x,z,radius=40
){

 const result=[];

 const half=state.boundary/2;

 for(

  let i=Math.floor((x-radius)/CELL);

  i<=Math.floor((x+radius)/CELL);

  i++

 ){

  for(

   let j=Math.floor((z-radius)/CELL);

   j<=Math.floor((z+radius)/CELL);

   j++

  ){

   const key=i+':'+j;

   const center=cellPosition(key);

   if(

    Math.abs(center.x)+CELL/2>half||

    Math.abs(center.z)+CELL/2>half

   )continue;

   if(

    Math.hypot(

     center.x-x,

     center.z-z

    )<=radius+CELL/2

   )result.push(key);
  }
 }

 return result;
}

function blockedCell(state,key){

 const o=cellObject(key);

 const {x,z}=o.position;

 // Preserve the developed original city.

 if(Math.abs(x)<600&&
    Math.abs(z)<600)

  return true;

 // Preserve river and waterfront.

 if(overlap(o,state.water,35))

  return true;

 for(const object of [

  ...state.buildings,

  ...state.parks,

  ...state.bridges,

  ...state.trees
 ]){

  if(overlap(o,object,8))

   return true;
 }

 for(const road of state.roads){

  if(road.path){

   if(pathHitsObject(

    road.path.points,

    road.path.width,

    o,8

   ))return true;

  }else if(overlap(o,road,8)){

   return true;
  }
 }

 return false;
}

export function terrainBlocksObject(
 state,object
){

 for(const [key,cell] of Object.entries(
  state.landscape??{}
 )){

  if(!cell.height&&!cell.pond)

   continue;

  if(overlap(

   cellObject(key),object,2

  ))return true;
 }

 return false;
}

export function terrainBlocksPath(
 state,points,width
){

 for(const [key,cell] of Object.entries(
  state.landscape??{}
 )){

  if(!cell.height&&!cell.pond)

   continue;

  if(pathHitsObject(

   points,width,cellObject(key),2

  ))return true;
 }

 return false;
}

export function validateLandscape(
 raw,state
){

 if(raw==null)return {};

 if(typeof raw!=='object'||
    Array.isArray(raw))

  throw Error('Invalid landscape data');

 const keys=Object.keys(raw);

 if(keys.length>10000)

  throw Error('Landscape too large');

 const result={};

 for(const key of keys){

  if(!/^-?\d{1,3}:-?\d{1,3}$/
      .test(key))

   throw Error('Invalid terrain cell');

  const o=cellObject(key);

  const {x,z}=o.position;

  if(

   Math.abs(x)+CELL/2>
    state.boundary/2||

   Math.abs(z)+CELL/2>
    state.boundary/2

  )throw Error('Terrain outside workspace');

  const cell=raw[key];

  if(!cell||

     !Number.isInteger(cell.height)||

     cell.height< -12||

     cell.height>30||

     typeof cell.pond!=='boolean'||

     !(cell.parcel===null||

       Object.hasOwn(
        LAND_COLORS,cell.parcel
       )))

   throw Error('Invalid terrain properties');

  if(cell.pond&&cell.height!==-8)

   throw Error('Invalid pond depth');

  if((cell.height||cell.pond)&&
     blockedCell(state,key))

   throw Error(
    'Terrain conflicts with city infrastructure'
   );

  result[key]={

   height:cell.height,

   pond:cell.pond,

   parcel:cell.parcel
  };
 }

 return result;
}

export function applyLandscape(
 model,tool,x,z,radius,
 candidate,validatePlacement
){

 const state=model.state;

 if(!LAND_TOOLS.includes(tool))

  return 'Unknown landscape tool';

 if(![x,z,radius].every(Number.isFinite)||

    radius<20||radius>120)

  return 'Invalid brush';

 const keys=brushCells(
  state,x,z,radius
 );

 if(!keys.length)

  return 'Outside editable workspace';

 if(tool==='clear-trees'){

  const trees=state.trees.filter(t=>

   Math.hypot(

    t.position.x-x,

    t.position.z-z

   )>radius
  );

  if(trees.length===state.trees.length)

   return 'No trees in brush area';

  model.checkpoint();

  state.trees=trees;

  return null;
 }

 if(tool==='paint-trees'){

  const added=[];

  for(const key of keys){

   const point=cellPosition(key);

   const o=candidate(
    'tree',point.x,point.z
   );

   if(terrainBlocksObject(state,o))

    continue;

   const staged={

    ...state,

    trees:[...state.trees,...added]
   };

   if(validatePlacement(

    staged,'tree',o

   ))continue;

   added.push(o);
  }

  if(!added.length)

   return 'No suitable planting locations';

  model.checkpoint();

  for(const o of added){

   o.id=model.nextId();

   state.trees.push(o);
  }

  return null;
 }

 const next=clone(
  state.landscape??{}
 );

 let changed=0;

 const terrainTool=[

  'raise-land',

  'lower-land',

  'flatten-land',

  'pond'

 ].includes(tool);

 for(const key of keys){

  if(terrainTool&&blockedCell(state,key))

   continue;

  const cell={...getCell(state,key)};

  const previous=JSON.stringify(cell);

  if(tool==='raise-land'){

   cell.height=Math.min(
    30,cell.height+3
   );

   cell.pond=false;

  }else if(tool==='lower-land'){

   cell.height=Math.max(
    -12,cell.height-3
   );

   cell.pond=false;

  }else if(tool==='flatten-land'){

   cell.height=0;

   cell.pond=false;

  }else if(tool==='pond'){

   cell.height=-8;

   cell.pond=true;

   cell.parcel=null;

  }else if(tool==='clear-parcel'){

   cell.parcel=null;

  }else{

   // Parcels are visual designations,
   // not restrictions on construction.

   if(cell.pond||
      overlap(
       cellObject(key),state.water,25
      ))

    continue;

   cell.parcel=tool.replace('-land','');
  }

  if(previous===JSON.stringify(cell))

   continue;

  changed++;

  if(!cell.height&&
     !cell.pond&&!cell.parcel){

   delete next[key];

  }else{

   next[key]=cell;
  }
 }

 if(!changed)

  return 'No editable land in brush area';

 model.checkpoint();

 state.landscape=next;

 return null;
}

// Efficient terrain rendering using rows
// of merged equal-height ground cells.

export function renderLandscape(view,state){

 const size=state.boundary;

 const half=size/2;

 const cells=state.landscape??{};

 // Lower foundation to allow depressions.

 view.box(

  '#8d9c7f',0,-36,0,

  size+10,26,size+10
 );

 if(!Object.values(cells).some(

  c=>c.height||c.pond

 )){

  view.box(

   '#b2c497',0,-1,0,

   size,8,size
  );

 }else{

  const bottom=-23;

  function ground(x,z,width,offset){

   const top=3+offset;

   const height=top-bottom;

   const color=offset>0

    ?'#aabd8e'

    :offset<0

     ?'#9aab84'

     :'#b2c497';

   view.box(

    color,

    x,bottom+height/2,z,

    width,height,CELL
   );
  }

  for(let z=-half;z<half;z+=CELL){

   let start=-half;

   let current=getCell(

    state,cellKey(start,z)

   ).height;

   for(let x=-half+CELL;

       x<=half;x+=CELL){

    const value=x===half

     ?null

     :getCell(
       state,cellKey(x,z)
      ).height;

    if(value===current)continue;

    ground(

     (start+x)/2,

     z+CELL/2,

     x-start,

     current
    );

    start=x;

    current=value;
   }
  }
 }

 for(const [key,cell] of Object.entries(
  cells
 )){

  const {x,z}=cellPosition(key);

  if(cell.pond){

   view.box(

    '#78b2bb',

    x,.1,z,

    CELL,.2,CELL
   );
  }

  if(cell.parcel&&!cell.pond){

   view.box(

    LAND_COLORS[cell.parcel],

    x,3+cell.height+.03,z,

    CELL-1,.06,CELL-1
   );

   for(const side of [-1,1]){

    view.box(

     '#e5e1cc',

     x+side*(CELL/2-.7),

     3+cell.height+.1,z,

     .7,.15,CELL-1
    );

    view.box(

     '#e5e1cc',

     x,

     3+cell.height+.1,

     z+side*(CELL/2-.7),

     CELL-1,.15,.7
    );
   }
  }
 }
}
