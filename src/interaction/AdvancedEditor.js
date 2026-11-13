
import * as THREE from 'three';

import {

 ASSET_GROUPS

} from '../core/AssetLibrary.js';

import {

 measureDistance,

 measureArea,

 visibleState

} from '../core/SpatialEditing.js';

export function attachAdvancedEditor({

 engine,

 panel,

 model,

 setMode,

 rebuild,

 tell,

 getMode

}){

 const section=document.createElement('div');

 section.id='advanced-editor';

 section.innerHTML=`
 <details>

  <summary>Asset library</summary>

  <div id="asset-groups"></div>

 </details>

 <details>

  <summary>Group editing</summary>

  <div class="advanced-grid">

   <button id="group-select">Multi-select</button>

   <button id="group-move">Move group</button>

   <button id="group-delete">Delete group</button>

   <button id="group-clear">Clear selection</button>

  </div>

  <small id="group-count">0 selected</small>

 </details>

 <details>

  <summary>Spatial tools</summary>

  <div class="advanced-grid">

   <button id="measure-distance">Distance</button>

   <button id="measure-area">Area</button>

   <button id="clear-measurement">Clear</button>

  </div>

  <div id="measurement-result">
   Select a measurement tool.
  </div>

  <small id="cursor-coordinates"></small>

 </details>

 <details>

  <summary>Display layers</summary>

  <div id="editor-layers"></div>

 </details>`;

 panel.querySelector(

  '#construction-tools'

 ).append(section);

 const get=id=>section.querySelector('#'+id);

 const selected=new Set();

 const points=[];

 const layers={

  buildings:true,

  roads:true,

  bridges:true,

  parks:true,

  trees:true,

  parcels:true
 };

 const scene=engine.view.scene;

 const overlay=new THREE.Group();

 scene.add(overlay);

 const material=new THREE.LineBasicMaterial({

  color:'#f2b85b',

  depthTest:false,

  transparent:true,

  opacity:1
 });

 const measurementMaterial=
  new THREE.LineBasicMaterial({

   color:'#fff1ba',

   depthTest:false
  });

 function clearOverlay(){

  for(const object of [...overlay.children]){

   overlay.remove(object);

   object.geometry.dispose();
  }
 }

 function redraw(){

  clearOverlay();

  for(const id of [...selected]){

   const found=model.find(id);

   if(!found){

    selected.delete(id);

    continue;
   }

   if(layers[found.key]===false)

    continue;

   const o=found.object;

   const d=o.dimensions;

   const tree=found.key==='trees';

   const geometry=new THREE.BoxGeometry(

    d.width*(tree?2:1)+4,

    d.height+10,

    d.depth*(tree?2:1)+4
   );

   const edges=new THREE.EdgesGeometry(
    geometry
   );

   geometry.dispose();

   const line=new THREE.LineSegments(

    edges,material
   );

   line.position.set(

    o.position.x,

    4+d.height/2,

    o.position.z
   );

   line.renderOrder=60;

   overlay.add(line);
  }

  if(points.length){

   const path=[...points];

   if(getMode()==='measure-area'&&points.length>2)

    path.push(points[0]);

   const geometry=new THREE.BufferGeometry()

    .setFromPoints(path.map(p=>

     new THREE.Vector3(p[0],38,p[1])
    ));

   const line=new THREE.Line(

    geometry,measurementMaterial
   );

   line.renderOrder=70;

   overlay.add(line);
  }

  get('group-count').textContent=

   selected.size+' selected';

  engine.invalidate();
 }

 function clearSelection(){

  selected.clear();

  redraw();
 }

 function clearMeasurement(){

  points.length=0;

  get('measurement-result').textContent=

   'Click points to measure.';

  redraw();
 }

 for(const [category,items] of Object.entries(

  ASSET_GROUPS

 )){

  const details=document.createElement(
   'details'
  );

  const summary=document.createElement(
   'summary'
  );

  summary.textContent=category;

  const grid=document.createElement('div');

  grid.className='advanced-grid';

  for(const [type,label] of items){

   const b=document.createElement('button');

   b.textContent=label;

   b.dataset.asset=type;

   b.onclick=()=>{

    setMode(type);

    tell('Click land to place '+label+'.');
   };

   grid.append(b);
  }

  details.append(summary,grid);

  get('asset-groups').append(details);
 }

 for(const key of Object.keys(layers)){

  const label=document.createElement('label');

  const checkbox=document.createElement('input');

  checkbox.type='checkbox';

  checkbox.checked=true;

  checkbox.onchange=()=>{

   layers[key]=checkbox.checked;

   rebuild();

   redraw();
  };

  const text=document.createElement('span');

  text.textContent=

   key[0].toUpperCase()+key.slice(1);

  label.append(checkbox,text);

  get('editor-layers').append(label);
 }

 get('group-select').onclick=()=>{

  setMode('multi-select');

  tell('Click objects to add or remove them.');
 };

 get('group-clear').onclick=clearSelection;

 get('group-move').onclick=()=>{

  if(!selected.size){

   tell('Select objects first.',true);

   return;
  }

  setMode('group-move');

  tell('Click the new position of the first selected object.');
 };

 get('group-delete').onclick=()=>{

  if(!selected.size){

   tell('Select objects first.',true);

   return;
  }

  const error=model.groupEdit(

   [...selected],'delete'
  );

  if(error){

   tell(error,true);

   return;
  }

  selected.clear();

  rebuild();

  redraw();

  tell('Selected objects deleted.');
 };

 get('measure-distance').onclick=()=>{

  setMode('measure-distance');

  clearMeasurement();
 };

 get('measure-area').onclick=()=>{

  setMode('measure-area');

  clearMeasurement();
 };

 get('clear-measurement').onclick=

  clearMeasurement;

 function handleClick(point,target){

  const mode=getMode();

  if(mode==='multi-select'){

   if(target){

    const found=model.find(target.id);

    if(found&&found.key!=='roads'&&

       layers[found.key]!==false){

     if(selected.has(target.id))

      selected.delete(target.id);

     else selected.add(target.id);
    }
   }

   redraw();

   return true;
  }

  if(mode==='group-move'){

   const id=[...selected][0];

   const found=model.find(id);

   if(!found){

    clearSelection();

    return true;
   }

   const x=Math.round(point.x/5)*5;

   const z=Math.round(point.z/5)*5;

   const error=model.groupEdit(

    [...selected],

    'move',

    x-found.object.position.x,

    z-found.object.position.z
   );

   if(error){

    tell(error,true);

    return true;
   }

   rebuild();

   redraw();

   setMode('multi-select');

   tell('Group moved.');

   return true;
  }

  if(mode==='measure-distance'||

     mode==='measure-area'){

   points.push([point.x,point.z]);

   const distance=measureDistance(points);

   const area=measureArea(points);

   get('measurement-result').textContent=

    mode==='measure-area'

     ?area.toFixed(1)+' m²'

     :distance.toFixed(1)+' m';

   redraw();

   return true;
  }

  return false;
 }

 function coordinates(point){

  const coordinates=get('cursor-coordinates');

  if(!coordinates.offsetParent)return;

  coordinates.textContent=

   'X '+point.x.toFixed(1)+

   ' · Z '+point.z.toFixed(1)+' m';
 }

 function dispose(){

  clearOverlay();

  scene.remove(overlay);

  material.dispose();

  measurementMaterial.dispose();

  section.remove();
 }

 return {

  layers,

  handleClick,

  coordinates,

  redraw,

  visibleState:()=>visibleState(
   engine.state,layers
  ),

  dispose
 };
}
