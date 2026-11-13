import {
 attachAdvancedEditor
} from './AdvancedEditor.js';
import {

 LAND_TOOLS,

 CELL

} from '../core/LandscapeEditor.js';

import {

 roadSegments,

 makePathRoad,

 validatePathRoad,

 pointSegmentDistance

} from '../core/RoadPaths.js';

import {
 resizeWorld
} from '../core/UniversalEditing.js';

import * as THREE from 'three';

import {SelectionManager}
 from './SelectionManager.js';

import {
 CATALOG,
 candidate,
 validatePlacement,
 ConstructionModel
} from '../core/ConstructionModel.js';

export function attachConstruction(engine){

 const view=engine.view;

 resizeWorld(engine.state,2400);

 const model=new ConstructionModel(
  engine.state
 );

 const canvas=view.renderer.domElement;

 const onSelect=engine.selection.onSelect;

 let mode='inspect';

 let selectedId=null;

 let advanced=null;

 let roadStart=null;

 let roadControl=null;

 let roadWidth=14;

 let brushRadius=40;
 let vertical=false;
 let length=60;
 let start=null;
 let selectionActive=true;

 const pointers=new Set();

 const ray=new THREE.Raycaster();

 const ground=new THREE.Plane(
  new THREE.Vector3(0,1,0),-4.5
 );

 const point=new THREE.Vector3();

 const preview=new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshBasicMaterial({
   color:'#39ae66',
   transparent:true,
   opacity:.45,
   depthWrite:false
  })
 );

 preview.visible=false;
 preview.renderOrder=10;

 view.scene.add(preview);

 // Construction toolbar.

 const panel=document.createElement('section');

 panel.id='construction-panel';

 panel.innerHTML=`
 <div class="construction-heading">
  <strong>EDIT THE CITY</strong>
  <button id="construction-toggle"
   aria-expanded="false">Edit</button>
 </div>

 <div id="construction-tools" hidden>

  <div class="construction-grid"></div>

  <div id="object-properties" hidden>

   <strong id="object-title">Object</strong>

   <div class="object-fields">

    <label>X
     <input data-property="x"
      type="number" step="5">
    </label>

    <label>Z
     <input data-property="z"
      type="number" step="5">
    </label>

    <label>Width
     <input data-property="width"
      type="number" min="2">
    </label>

    <label>Depth
     <input data-property="depth"
      type="number" min="2">
    </label>

    <label>Height
     <input data-property="height"
      type="number" min="1">
    </label>

    <label>Colour
     <input data-property="color"
      type="color">
    </label>

    <label class="full-property">
     District
     <input data-property="district"
      type="text" maxlength="80">
    </label>

   </div>

   <div class="object-actions">

    <button data-edit="apply">
     Apply changes
    </button>

    <button data-edit="rotate">
     Rotate 90°
    </button>

    <button data-edit="move">
     Move
    </button>

    <button data-edit="duplicate">
     Duplicate
    </button>

    <button data-edit="widen" hidden>

     Change road width

    </button>

    <button data-edit="delete">
     Delete
    </button>

   </div>

  </div>

  <div id="world-controls">

   <small id="world-size"></small>

   <button id="expand-world">
    Expand workspace
   </button>

  </div>

  <div id="landscape-tools">

   <details>

    <summary>Terrain &amp; landscaping</summary>

    <div class="landscape-grid">

     <button data-land="raise-land">
      Raise
     </button>

     <button data-land="lower-land">
      Lower
     </button>

     <button data-land="flatten-land">
      Flatten
     </button>

     <button data-land="pond">
      Pond
     </button>

     <button data-land="paint-trees">
      Plant trees
     </button>

     <button data-land="clear-trees">
      Clear trees
     </button>

    </div>

   </details>

   <details>

    <summary>Land parcels</summary>

    <div class="landscape-grid">

     <button data-land="residential-land">
      Residential
     </button>

     <button data-land="commercial-land">
      Commercial
     </button>

     <button data-land="public-land">
      Public
     </button>

     <button data-land="clear-parcel">
      Clear parcel
     </button>

    </div>

   </details>

   <div id="landscape-brush" hidden>

    <label>

     Brush size

     <select id="brush-size">

      <option value="20">
       Small
      </option>

      <option value="40" selected>
       Medium
      </option>

      <option value="80">
       Large
      </option>

      <option value="120">
       Extra large
      </option>

     </select>

    </label>

   </div>

  </div>

  <div id="path-road-options" hidden>

   <label>

    Road width

    <select id="path-road-width">

     <option value="10">10 m</option>

     <option value="14" selected>14 m</option>

     <option value="20">20 m</option>

     <option value="28">28 m</option>

    </select>

   </label>

   <button id="cancel-path">
    Cancel drawing
   </button>

  </div>

  <div id="road-options" hidden>

   <label>
    Road length
    <select id="road-length">
     <option value="40">40 m</option>
     <option value="60" selected>60 m</option>
     <option value="100">100 m</option>
    </select>
   </label>

   <button data-action="rotate">Rotate</button>

  </div>

  <div class="construction-actions">
   <button data-action="undo">Undo</button>
   <button data-action="redo">Redo</button>
  </div>

  <div class="construction-stats"></div>

  <p id="construction-message" role="status">
   Choose a construction tool.
  </p>

 </div>`;

 document.body.append(panel);

 const grid=panel.querySelector(
  '.construction-grid'
 );

 const tools=panel.querySelector(
  '#construction-tools'
 );

 const message=panel.querySelector(
  '#construction-message'
 );

 const stats=panel.querySelector(
  '.construction-stats'
 );

 const roadOptions=panel.querySelector(
  '#road-options'
 );

 const modes=[
  ['inspect','Inspect'],
  ['edit','Select object'],
  ['tree','Tree'],
  ['house','House'],
  ['apartment','Apartment'],
  ['commercial','Commercial'],
  ['office','Office'],
  ['hospital','Hospital'],
  ['school','School'],
  ['civic','Civic'],
  ['park','Park'],
  ['road','Road segment'],

  ['draw-road','Draw road'],

  ['curve-road','Curve'],

  ['draw-bridge','Bridge'],
  ['demolish','Demolish'],
  ['upgrade','Upgrade']
 ];

 function tell(text,error=false){

  message.textContent=text;
  message.dataset.error=String(error);
 }

 function updateStats(){

  const s=engine.state;

  panel.querySelector(
   '#world-size'
  ).textContent=
   s.boundary+' × '+s.boundary+' m';

  panel.querySelector(
   '#expand-world'
  ).disabled=s.boundary>=3600;

  stats.textContent=
   s.buildings.length+' buildings · '+
   s.roads.length+' roads · '+
   s.parks.length+' parks';

  document.querySelector(
   '#building-count'
  ).textContent=
   s.buildings.length+' buildings';

  document.querySelector(
   '#district-count'
  ).textContent=
   new Set([
    ...s.buildings,
    ...s.parks
   ].map(o=>o.district)).size+
   ' districts';

  panel.querySelector(
   '[data-action="undo"]'
  ).disabled=!model.undoStack.length;

  panel.querySelector(
   '[data-action="redo"]'
  ).disabled=!model.redoStack.length;
 }

 function setMode(next){

  mode=next;

  panel.querySelector(
   '#landscape-brush'
  ).hidden=!LAND_TOOLS.includes(mode);

  panel.querySelectorAll(
   '[data-land]'
  ).forEach(button=>

   button.setAttribute(

    'aria-pressed',

    String(button.dataset.land===mode)
   )
  );

  roadStart=null;

  roadControl=null;

  clearRoadPreview();

  hideBrush();

  panel.querySelector(
   '#path-road-options'
  ).hidden=!pathMode();

  if(!['edit','move','duplicate'].includes(mode)){

   selectedId=null;

   panel.querySelector(
    '#object-properties'
   ).hidden=true;
  }

  preview.visible=false;
  start=null;
  pointers.clear();

  if(selectionActive&&mode!=='inspect'){

   engine.selection.dispose();
   selectionActive=false;

  }else if(!selectionActive&&mode==='inspect'){

   engine.selection=new SelectionManager(
    view,onSelect
   );

   selectionActive=true;
  }

  view.highlight(null);
  onSelect(null);

  grid.querySelectorAll('button').forEach(
   b=>b.setAttribute(
    'aria-pressed',
    String(b.dataset.tool===mode)
   )
  );

  roadOptions.hidden=mode!=='road';

  canvas.style.cursor=
   mode==='inspect'?'':'crosshair';

  tell(
   mode==='inspect'
    ?'Click buildings to inspect.'
    :mode==='demolish'
     ?'Click a structure to demolish.'
     :mode==='upgrade'
      ?'Click a building to upgrade.'
      :'Choose an empty location.'
  );

  engine.invalidate();
 }

 for(const [value,label] of modes){

  const b=document.createElement('button');

  b.textContent=label;
  b.dataset.tool=value;

  b.onclick=()=>setMode(value);

  grid.append(b);
 }

 const toggle=panel.querySelector(
  '#construction-toggle'
 );

 toggle.onclick=()=>{

  tools.hidden=!tools.hidden;

  toggle.textContent=
   tools.hidden?'Edit':'Close';

  toggle.setAttribute(
   'aria-expanded',String(!tools.hidden)
  );

  if(tools.hidden)setMode('inspect');

  updateStats();
 };

 const brushCursor=new THREE.Mesh(

  new THREE.RingGeometry(.92,1,48),

  new THREE.MeshBasicMaterial({

   color:'#e9f4cc',

   side:THREE.DoubleSide,

   transparent:true,

   opacity:.9,

   depthTest:false,

   depthWrite:false
  })
 );

 brushCursor.rotation.x=-Math.PI/2;

 brushCursor.visible=false;

 brushCursor.renderOrder=50;

 view.scene.add(brushCursor);

 function hideBrush(){

  brushCursor.visible=false;
 }

 function showBrush(){

  preview.visible=false;

  brushCursor.position.set(

   point.x,35,point.z
  );

  brushCursor.scale.set(

   brushRadius,

   brushRadius,

   1
  );

  brushCursor.visible=true;

  engine.invalidate();
 }

 panel.querySelectorAll(
  '[data-land]'
 ).forEach(button=>{

  button.onclick=()=>{

   setMode(button.dataset.land);

   tell('Click land to apply the brush.');
  };
 });

 panel.querySelector(
  '#brush-size'
 ).onchange=event=>{

  brushRadius=Number(event.target.value);

  hideBrush();

  engine.invalidate();
 };

 const roadPreview=new THREE.Group();

 view.scene.add(roadPreview);

 const roadPreviewGeometry=
  new THREE.BoxGeometry(1,1,1);

 const roadPreviewMaterial=
  new THREE.MeshBasicMaterial({

   color:'#39ae66',

   transparent:true,

   opacity:.65,

   depthWrite:false
  });

 function pathMode(){

  return [

   'draw-road',

   'curve-road',

   'draw-bridge'

  ].includes(mode);
 }

 function clearRoadPreview(){

  roadPreview.clear();
 }

 function previewRoad(points,valid){

  clearRoadPreview();

  roadPreviewMaterial.color.set(

   valid?'#39ae66':'#d75e54'
  );

  for(let i=1;i<points.length;i++){

   const a=points[i-1];

   const b=points[i];

   const dx=b[0]-a[0];

   const dz=b[1]-a[1];

   const mesh=new THREE.Mesh(

    roadPreviewGeometry,

    roadPreviewMaterial
   );

   mesh.position.set(

    (a[0]+b[0])/2,

    6.5,

    (a[1]+b[1])/2
   );

   mesh.scale.set(

    roadWidth,

    .5,

    Math.hypot(dx,dz)+2
   );

   mesh.rotation.y=Math.atan2(dx,dz);

   roadPreview.add(mesh);
  }

  engine.invalidate();
 }

 function pathPoint(){

  return [

   Math.round(point.x/5)*5,

   Math.round(point.z/5)*5
  ];
 }

 function updateRoadPreview(){

  if(!roadStart)return;

  const end=pathPoint();

  try{

   const points=roadSegments(

    roadStart,end,roadWidth,roadControl
   );

   const road=makePathRoad(

    points,roadWidth,

    mode==='draw-bridge'
   );

   const error=validatePathRoad(

    engine.state,road
   );

   previewRoad(points,!error);

   tell(

    mode==='curve-road'&&!roadControl

     ?'Choose the curve control point.'

     :error||'Click to complete road.',

    !!error&&(
     mode!=='curve-road'||!!roadControl
    )
   );

  }catch(error){

   clearRoadPreview();
  }
 }

 function commitRoadPoint(){

  const point=pathPoint();

  if(!roadStart){

   roadStart=point;

   tell(

    mode==='curve-road'

     ?'Choose the curve control point.'

     :'Choose the road destination.'
   );

   return;
  }

  if(mode==='curve-road'&&!roadControl){

   roadControl=point;

   tell('Choose the curve destination.');

   return;
  }

  const error=model.drawRoad(

   roadStart,

   point,

   roadWidth,

   roadControl,

   mode==='draw-bridge'
  );

  if(error){

   tell(error,true);

   return;
  }

  roadStart=null;

  roadControl=null;

  clearRoadPreview();

  rebuild();

  tell('Road created.');
 }

 panel.querySelector(
  '#path-road-width'
 ).onchange=event=>{

  roadWidth=Number(event.target.value);

  clearRoadPreview();
 };

 panel.querySelector(
  '#cancel-path'
 ).onclick=()=>{

  roadStart=null;

  roadControl=null;

  clearRoadPreview();

  tell('Drawing cancelled.');

  engine.invalidate();
 };

 function locate(event){

  const rect=canvas.getBoundingClientRect();

  if(!rect.width||!rect.height)return null;

  view.camera.updateMatrixWorld();

  ray.setFromCamera(
   new THREE.Vector2(
    (event.clientX-rect.left)/rect.width*2-1,
    -(event.clientY-rect.top)/rect.height*2+1
   ),
   view.camera
  );

  return ray.ray.intersectPlane(
   ground,point
  );
 }

 function findTarget(){

  let result=null;
  let closest=Infinity;

  const s=engine.state;

  const objects=mode==='upgrade'
   ?s.buildings
   :[
    ...s.buildings,
    ...s.parks,
    ...s.roads,
    ...s.trees
   ];

  for(const b of objects){

   const category=model.find(b.id)?.key;

   if(advanced?.layers[category]===false)

    continue;

   const {x,z}=b.position;

   const {width:w,depth:d,height:h}=
    b.dimensions;

   const isBuilding=s.buildings.includes(b);

   const bounds=new THREE.Box3(
    new THREE.Vector3(
     x-w/2,3,z-d/2
    ),
    new THREE.Vector3(
     x+w/2,
     isBuilding?h+13:
     b.type==='tree'?h+8:5,
     z+d/2
    )
   );

   if(b.path){

    const distance=b.path.points
     .slice(1).reduce((best,p,i)=>

      Math.min(

       best,

       pointSegmentDistance(

        [point.x,point.z],

        b.path.points[i],p
       )
      ),

      Infinity
     );

    if(distance>b.path.width/2+3)

     continue;

    const score=point.distanceToSquared(
     ray.ray.origin
    );

    if(score<closest){

     closest=score;

     result=b;
    }

    continue;
   }

   const hit=ray.ray.intersectBox(
    bounds,new THREE.Vector3()
   );

   if(!hit)continue;

   const distance=hit.distanceToSquared(
    ray.ray.origin
   );

   if(distance<closest){

    result=b;
    closest=distance;
   }
  }

  return result;
 }

 // Rebuild static geometry without replacing
 // the scene, renderer, lighting or camera.

 function rebuild(){

  const night=
   document.documentElement.dataset.mode==='night';

  const previous=engine.activity;

  const ActivityClass=previous.constructor;

  const level=previous.level;
  const time=previous.time;
  const paused=previous.paused;

  previous.dispose();

  view.highlight(null);
  onSelect(null);

  for(const object of [...view.scene.children]){

   if(object.isInstancedMesh&&
      Array.isArray(object.userData.ids)){

    view.scene.remove(object);
    object.material.dispose();
    object.dispose();
   }
  }

  view.pickables.length=0;
  view.batches.clear();

  engine.camera.worldSize=
   engine.state.boundary;

  engine.camera.controls.maxDistance=
   Math.max(6000,engine.state.boundary*3);

  view.camera.far=
   engine.state.boundary*5;

  view.camera.updateProjectionMatrix();

  const actualState=view.state;

  try{

   if(advanced){

    view.state=advanced.visibleState();
   }

   view.build();

  }finally{

   view.state=actualState;
  }
  view.flush();

  // Recreate activity against the edited city.

  engine.activity=new ActivityClass(view);

  engine.activity.time=time;
  engine.activity.setLevel(level);
  engine.activity.paused=paused;
  engine.activity.setNight(night);

  view.setDayNight(night);

  if(selectionActive){

   engine.selection.dispose();

   engine.selection=new SelectionManager(
    view,onSelect
   );
  }

  updateStats();

  advanced?.redraw();

  engine.onCityChanged?.();

  view.renderer.shadowMap.needsUpdate=true;

  preview.visible=false;

  engine.invalidate();
 }

 function showProperties(id){

  const selected=model.find(id);

  const box=panel.querySelector(
   '#object-properties'
  );

  if(!selected){

   box.hidden=true;
   selectedId=null;
   return;
  }

  selectedId=id;

  const {key,object:o}=selected;

  box.hidden=false;

  panel.querySelector(
   '#object-title'
  ).textContent=o.type+' · '+o.id;

  const values={

   x:o.position.x,

   z:o.position.z,

   width:o.dimensions.width,

   depth:o.dimensions.depth,

   height:o.dimensions.height,

   color:o.visual.color||'#b8c6ad',

   district:o.district
  };

  box.querySelectorAll(
   '[data-property]'
  ).forEach(input=>{

   input.value=
    values[input.dataset.property];
  });

  const locked=key==='roads'&&
   model.originalRoads.has(id);

  box.querySelectorAll(
   'input,button'
  ).forEach(input=>{

   input.disabled=locked;
  });

  const height=box.querySelector(
   '[data-property="height"]'
  );

  height.disabled=locked||
   key==='parks'||key==='roads';

  box.querySelector(
   '[data-property="depth"]'
  ).disabled=locked||key==='trees';

  box.querySelector(
   '[data-edit="duplicate"]'
  ).disabled=locked||key==='roads';

  const isPath=!!o.path;

  if(isPath){

   box.querySelectorAll(
    'input'
   ).forEach(i=>i.disabled=true);

   for(const action of [

    'apply','rotate','move','duplicate'

   ]){

    box.querySelector(

     '[data-edit="'+action+'"]'

    ).disabled=true;
   }
  }

  box.querySelector(
   '[data-edit="widen"]'
  ).hidden=!isPath;

  tell(locked
   ?'Original road is protected.'
   :'Edit properties or choose Move.'
  );
 }

 function completeEdit(error){

  if(error){

   tell(error,true);
   return;
  }

  rebuild();

  setMode('edit');

  showProperties(selectedId);

  tell('Object updated.');
 }

 panel.querySelector(
  '[data-edit="apply"]'
 ).onclick=()=>{

  const fields={};

  panel.querySelectorAll(
   '[data-property]'
  ).forEach(input=>{

   if(input.disabled)return;

   const key=input.dataset.property;

   fields[key]=input.type==='number'
    ?input.value===''?NaN:Number(input.value)
    :input.value;
  });

  completeEdit(
   model.edit(selectedId,fields)
  );
 };

 panel.querySelector(
  '[data-edit="rotate"]'
 ).onclick=()=>{

  completeEdit(
   model.edit(selectedId,{rotate:true})
  );
 };

 panel.querySelector(
  '[data-edit="move"]'
 ).onclick=()=>{

  setMode('move');

  tell('Click the new object location.');
 };

 panel.querySelector(
  '[data-edit="duplicate"]'
 ).onclick=()=>{

  setMode('duplicate');

  tell('Click the location for the copy.');
 };

 panel.querySelector(
  '[data-edit="widen"]'
 ).onclick=()=>{

  const found=model.find(selectedId);

  if(!found?.object.path)return;

  const widths=[10,14,20,28];

  const current=widths.indexOf(
   found.object.path.width
  );

  const next=widths[
   (current+1)%widths.length
  ];

  completeEdit(

   model.widenRoad(selectedId,next)
  );
 };

 panel.querySelector(
  '[data-edit="delete"]'
 ).onclick=()=>{

  const error=model.demolish(
   selectedId
  );

  if(error){

   tell(error,true);
   return;
  }

  selectedId=null;

  rebuild();

  showProperties(null);

  tell('Object deleted.');
 };

 panel.querySelector(
  '#expand-world'
 ).onclick=()=>{

  const error=model.expand();

  if(error){

   tell(error,true);
   return;
  }

  rebuild();

  tell('Workspace expanded.');
 };

 function showPreview(object,valid){

  const {width:w,depth:d,height:h}=
   object.dimensions;

  preview.position.set(
   object.position.x,
   4.5+Math.max(h,2)/2,
   object.position.z
  );

  preview.scale.set(
   w,Math.max(h,2),d
  );

  preview.material.color.set(
   valid?'#39ae66':'#db514b'
  );

  preview.visible=true;

  engine.invalidate();
 }

 let lastPreviewTime=-Infinity;

 function move(event){

  // Do not calculate editing previews
  // during camera-only gestures.

  if(event.shiftKey||
     event.ctrlKey||
     event.metaKey||
     event.altKey||
     (event.buttons&&!start)){

   preview.visible=false;

   hideBrush();

   clearRoadPreview();

   engine.invalidate();

   return;
  }

  // Keep drag detection immediate.
  // Throttle idle editing previews only.

  if(!event.buttons){

   const now=performance.now();

   if(now-lastPreviewTime<33)return;

   lastPreviewTime=now;
  }


  if(mode==='inspect')return;

  if(start&&Math.hypot(
   event.clientX-start.x,
   event.clientY-start.y
  )>6){

   start.dragged=true;

   hideBrush();

   preview.visible=false;
   engine.invalidate();

   return;
  }

  if(!locate(event))return;

  advanced?.coordinates(point);

  if([

   'multi-select',

   'group-move',

   'measure-distance',

   'measure-area'

  ].includes(mode)){

   preview.visible=false;

   return;
  }

  if(LAND_TOOLS.includes(mode)){

   showBrush();

   return;
  }

  if(pathMode()){

   updateRoadPreview();

   return;
  }

  if(mode==='move'||mode==='duplicate'){

   const selected=model.find(selectedId);

   if(!selected)return;

   const object=structuredClone(
    selected.object
   );

   object.position.x=
    Math.round(point.x/5)*5;

   object.position.z=
    Math.round(point.z/5)*5;

   showPreview(object,true);

   return;
  }

  if(Object.hasOwn(CATALOG,mode)){

   const o=candidate(
    mode,point.x,point.z,vertical,length
   );

   const reason=validatePlacement(
    engine.state,mode,o
   );

   showPreview(o,!reason);

   tell(
    reason||'Valid location — click to build.',
    !!reason
   );

  }else{

   const target=findTarget();

   if(target){

    showPreview(target,mode==='upgrade');

    tell(
     mode==='demolish'
      ?'Click to demolish '+target.type
      :'Click to upgrade '+target.type
    );

   }else{

    preview.visible=false;
    engine.invalidate();
   }
  }
 }

 function down(event){

  // Modified drags belong to the camera.

  if(event.button!==0||
     event.shiftKey||
     event.ctrlKey||
     event.metaKey||
     event.altKey){

   cancel();

   clearRoadPreview();

   return;
  }


  if(mode==='inspect')return;

  pointers.add(event.pointerId);

  if(pointers.size>1){

   if(start)start.dragged=true;

   preview.visible=false;
   engine.invalidate();

   return;
  }

  if(event.button!==0)return;

  start={
   x:event.clientX,
   y:event.clientY,
   pointerId:event.pointerId,
   dragged:false
  };
 }

 function up(event){

  if(event.shiftKey||
     event.ctrlKey||
     event.metaKey||
     event.altKey){

   cancel();

   return;
  }


  pointers.delete(event.pointerId);

  const previous=start;
  start=null;

  if(mode==='inspect'||!previous||
     previous.dragged||
     previous.pointerId!==event.pointerId||
     event.button!==0)return;

  if(Math.hypot(
   event.clientX-previous.x,
   event.clientY-previous.y
  )>6)return;

  if(!locate(event))return;

  if(LAND_TOOLS.includes(mode)){

   const error=model.landscapeBrush(

    mode,

    point.x,

    point.z,

    brushRadius
   );

   if(error){

    tell(error,true);

    return;
   }

   rebuild();

   showBrush();

   tell('Landscape updated.');

   return;
  }

  if(pathMode()){

   commitRoadPoint();

   return;
  }

  if(advanced){

   const specialMode=[

    'multi-select',

    'group-move',

    'measure-distance',

    'measure-area'

   ].includes(mode);

   if(specialMode&&advanced.handleClick(

    point,

    mode==='multi-select'
     ?findTarget():null

   ))return;
  }

  let reason;

  if(mode==='edit'){

   const target=findTarget();

   showProperties(target?.id);

   return;
  }

  if(mode==='move'||mode==='duplicate'){

   const x=Math.round(point.x/5)*5;

   const z=Math.round(point.z/5)*5;

   const error=mode==='move'

    ?model.edit(selectedId,{x,z})

    :model.duplicate(selectedId,x,z);

   completeEdit(error);

   return;
  }

  if(Object.hasOwn(CATALOG,mode)){

   reason=model.place(
    mode,
    point.x,
    point.z,
    vertical,
    length
   );

  }else{

   const target=findTarget();

   if(!target){

    tell('No structure selected.',true);
    return;
   }

   reason=mode==='demolish'
    ?model.demolish(target.id)
    :model.upgrade(target.id);
  }

  if(reason){

   tell(reason,true);
   return;
  }

  rebuild();

  tell('City updated successfully.');
 }

 function cancel(){

  hideBrush();

  start=null;
  pointers.clear();

  preview.visible=false;

  engine.invalidate();
 }

 function rotate(){

  vertical=!vertical;

  preview.visible=false;

  tell(
   vertical
    ?'Road orientation: north–south'
    :'Road orientation: east–west'
  );

  engine.invalidate();
 }

 panel.querySelector(
  '#road-length'
 ).onchange=event=>{

  length=Number(event.target.value);

  preview.visible=false;

  tell('Road length: '+length+' m');

  engine.invalidate();
 };

 panel.querySelector(
  '[data-action="rotate"]'
 ).onclick=rotate;

 panel.querySelector(
  '[data-action="undo"]'
 ).onclick=()=>{

  if(model.undo()){

   rebuild();
   tell('Decision reversed.');
  }
 };

 panel.querySelector(
  '[data-action="redo"]'
 ).onclick=()=>{

  if(model.redo()){

   rebuild();
   tell('Decision restored.');
  }
 };

 function key(event){

  if(event.target.matches?.(
   'input,select,textarea'
  ))return;

  if(event.key==='Escape'){

   setMode('inspect');

  }else if(
   event.key.toLowerCase()==='r'&&
   mode==='road'
  ){

   rotate();
  }
 }

 const handlers={
  pointerdown:down,
  pointermove:move,
  pointerup:up,
  pointercancel:cancel,
  pointerleave:cancel
 };

 for(const [type,fn] of Object.entries(handlers))
  canvas.addEventListener(type,fn);

 // Passive listener: OrbitControls retains
 // complete ownership of wheel and pinch.

 function navigationWheel(){

  preview.visible=false;

  hideBrush();

  clearRoadPreview();

  start=null;

  engine.invalidate();
 }

 canvas.addEventListener(
  'wheel',
  navigationWheel,
  {passive:true}
 );

 window.addEventListener('keydown',key);

 // Integrate cleanup into engine disposal.

 const oldDispose=engine.dispose.bind(engine);

 engine.dispose=()=>{

  for(const [type,fn] of Object.entries(handlers))
   canvas.removeEventListener(type,fn);

  canvas.removeEventListener(
   'wheel',navigationWheel
  );

  window.removeEventListener('keydown',key);

  clearRoadPreview();

  view.scene.remove(brushCursor);

  brushCursor.geometry.dispose();

  brushCursor.material.dispose();

  view.scene.remove(roadPreview);

  roadPreviewGeometry.dispose();

  roadPreviewMaterial.dispose();

  view.scene.remove(preview);

  preview.geometry.dispose();
  preview.material.dispose();

  advanced?.dispose();

  panel.remove();

  oldDispose();
 };

 engine.construction=model;

 // Reusable hook for the future save/load module.

 engine.rebuildCity=rebuild;

 advanced=attachAdvancedEditor({

  engine,

  panel,

  model,

  setMode,

  rebuild,

  tell,

  getMode:()=>mode
 });

 setMode('inspect');

 rebuild();

 updateStats();

 return model;
}
