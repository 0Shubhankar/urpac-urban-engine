import {
 ASSETS,
 renderAsset
} from '../core/AssetLibrary.js';
import {

 renderLandscape

} from '../core/LandscapeEditor.js';

import {streetLamps}
 from '../generators/StreetLife.js';
import {parkDetails}
 from '../generators/ParkDetails.js';
import {waterfrontParts}
 from '../generators/Waterfront.js';
import {buildingDetails}
 from '../generators/BuildingDetails.js';
import {buildingMassing}
 from '../generators/BuildingMassing.js';
import * as THREE from 'three';
import {addLighting,setLightingMode} from './Lighting.js';
// All static details are grouped by geometry/material into instanced batches.
export class CityRenderer {
 constructor(container,state){
 this.state=state;this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#e9eee7');
 this.camera=new THREE.PerspectiveCamera(38,1,2,6500);
 this.renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.autoUpdate=false;this.renderer.shadowMap.needsUpdate=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;container.appendChild(this.renderer.domElement);
 this.geometries={front:new THREE.PlaneGeometry(1,1),side:new THREE.PlaneGeometry(1,1).rotateY(Math.PI/2),box:new THREE.BoxGeometry(1,1,1),cone:new THREE.ConeGeometry(1,1,7),sphere:new THREE.IcosahedronGeometry(1,1),cylinder:new THREE.CylinderGeometry(1,1,1,8)};const roof=new THREE.BufferGeometry();roof.setAttribute('position',new THREE.Float32BufferAttribute([-.5,0,-.5,.5,0,-.5,0,1,-.5, -.5,0,.5,0,1,.5,.5,0,.5, -.5,0,-.5,0,1,-.5,0,1,.5, -.5,0,-.5,0,1,.5,-.5,0,.5, .5,0,-.5,.5,0,.5,0,1,.5, .5,0,-.5,0,1,.5,0,1,-.5],3));roof.computeVertexNormals();this.geometries.roof=roof;this.batches=new Map();this.pickables=[];this.lights=addLighting(this.scene);this.build();this.flush();
 this.observer=new ResizeObserver(()=>this.resize(container));this.observer.observe(container);this.resize(container);
 }
 part(shape,color,x,y,z,w,h,d,id=null,rotation=0){

 const t=this.buildingTransform;

 if(t){

  const dx=x-t.x;
  const dz=z-t.z;

  const cosine=Math.cos(t.angle);
  const sine=Math.sin(t.angle);

  x=t.x+dx*cosine+dz*sine;
  z=t.z-dx*sine+dz*cosine;

  rotation+=t.angle;
 }
 const key=`${shape}:${color}`;if(!this.batches.has(key))this.batches.set(key,{shape,color,items:[]});this.batches.get(key).items.push({x,y,z,w,h,d,id,rotation});}
 box(color,x,y,z,w,h,d,id=null){this.part('box',color,x,y,z,w,h,d,id);}
 build(){const s=this.state;
 const size=s.boundary;
 renderLandscape(this,s);
 // A recessed river and a raised, continuous riverside promenade.
 this.box('#68a9ad',0,3,0,110,1,size);
 for(const x of [-59,59])this.box('#c6c7ac',x,4,0,8,5,size);
 for(const x of [-74,74])this.box('#dbd7bf',x,3,0,20,2,size);
 for(let z=-size/2+30;z<size/2;z+=52)this.box('#92c1bd',0,3.6,z,65,0.1,1.2);

 // Procedural waterfront infrastructure.
 for(const p of waterfrontParts(s)){
  this.box(
   p.color,p.x,p.y,p.z,
   p.width,p.height,p.depth
  );
 }

 // Roadside streetlights.
 for(const l of streetLamps(s)){

  this.box('#596863',
   l.x,8,l.z,.65,8,.65);

  this.box('#596863',
   l.x+l.dx*1.5,12,l.z+l.dz*1.5,
   l.dx?3.6:.65,.55,l.dz?3.6:.65);

  this.box('#f0dfaf',
   l.x+l.dx*3,11.7,l.z+l.dz*3,
   1.5,.65,1.5);
 }

 for(const r of s.roads){

  if(r.path){

   this.drawPathRoad(r);

   continue;
  }
const {x,z}=r.position,{width:w,depth:d}=r.dimensions;this.box('#d4d2bc',x,3,z,w+9,2,d+9);this.box('#6f7b75',x,4.1,z,w,.3,d);

 const axis=r.axis??(w<100?'z':'x');
 const length=axis==='z'?d:w;
 const center=axis==='z'?z:x;

 for(let k=center-length/2+15;
     k<center+length/2-10;k+=25){

  const px=axis==='z'?x:k;
  const pz=axis==='z'?k:z;

  if(s.roads.some(q=>
   q!==r &&
   (q.axis??(q.dimensions.width<100?'z':'x'))!==axis &&
   Math.abs(px-q.position.x)<q.dimensions.width/2+7 &&
   Math.abs(pz-q.position.z)<q.dimensions.depth/2+7
  ))continue;

  this.box(
   '#d8d7ba',px,4.4,pz,
   axis==='z'?1:10,.1,axis==='z'?10:1
  );
 }
 }
 for(const b of s.bridges){const z=b.position.z,d=b.dimensions.depth;for(const dz of [-d/2-2,d/2+2]){this.box('#e6dfc8',0,7,z+dz,152,3,2);for(const x of [-48,48])this.box('#b9baa6',x,2,z+dz,5,8,5);}}
 for(const p of s.parks){const {x,z}=p.position,{width:w,depth:d}=p.dimensions;this.box(p.visual.color,x,3,z,w+5,1,d+5);this.box('#ded5b6',x,4,z,w,.5,7);this.box('#ded5b6',x,4,z,7,.5,d);if(x<0){
 this.part('cylinder','#d5d7c3',
  x,4.5,z,13,2,13);
 this.part('cylinder','#7fb4b2',
  x,5.7,z,10,.5,10);
 }else{
 this.box('#d7cab0',x,4.4,z,16,.6,16);
 this.box('#c3b59a',x,4.8,z,8,.2,8);
 }}
 // Gentle landscaped relief is limited to the outer boundary, away from plots.
 for(const x of [-size/2+20,size/2-20])for(const z of [-400,-100,200,420])this.part('sphere','#a7bd8d',x,0,z,20,9,65);

 // Additional park furniture and public spaces.
 for(const p of parkDetails(s)){
  this.box(
   p.color,p.x,p.y,p.z,
   p.width,p.height,p.depth
  );
 }
 for(const b of s.buildings)this.building(b);
 for(const t of s.trees){const {x,z}=t.position,h=t.dimensions.height,w=t.dimensions.width;this.part('cylinder','#8b8164',x,6,z,1.5,8,1.5);this.part('sphere',t.visual.color,x,h*.65+5,z,w,h*.48,w);}
 }
 building(b){

  const angle=b.orientation||0;

  const quarter=Math.round(
   angle/(Math.PI/2)
  );

  const local={

   ...b,

   dimensions:{
    ...b.dimensions
   }
  };

  if(Math.abs(quarter)%2){

   const d=local.dimensions;

   [d.width,d.depth]=[d.depth,d.width];
  }

  this.buildingTransform={

   x:b.position.x,

   z:b.position.z,

   angle
  };

  try{

   this.buildLocalBuilding(local);

  }finally{

   this.buildingTransform=null;
  }
 }

 buildLocalBuilding(b){

  if(Object.hasOwn(ASSETS,b.type)){

   renderAsset(this,b);

   return;
  }
const {x,z}=b.position,{width:w,depth:d,height:h}=b.dimensions,id=b.id,y=4;
 this.box('#c9c7ad',x,3,z,w+7,1,d+7,id);
 const tiers=buildingMassing(b);
 const top=tiers[tiers.length-1];
 const details=buildingDetails(b,tiers);


 for(const t of tiers){
  this.box(
   b.visual.color,
   x,y+(t.bottom+t.top)/2,z,
   t.width,t.top-t.bottom,t.depth,id
  );
 }
 if(b.type==='house') {this.part(
  'roof',b.visual.roof,x,y+h,z,
  details.roofRotation?d+4:w+4,
  details.roofHeight,
  details.roofRotation?w+4:d+4,
  id,details.roofRotation
 );this.box('#eee2c9',x+w*.25,y+h+4,z,3,9,3,id);}
 else{
 this.box('#f1ead8',x,y+h,z,
  top.width+2,1.6,top.depth+2,id);
 this.box(b.visual.roof,x,y+h+1,z,
  top.width-3,1,top.depth-3,id);
 this.box('#b6b5a4',x+3,y+h+3,z,8,4,7,id);
 }
 const glass=b.type==='office'
  ?details.officeGlass:'#687d79';

 for(const t of tiers){
  const tw=t.width,td=t.depth;

  for(let yy=y+t.bottom+5;
      yy+2<=y+t.top;
      yy+=b.type==='office'?9:8){

   for(const zz of [-1,1])
    for(let xx=-tw/2+5;xx<tw/2-2;xx+=7)
     this.part('front',glass,
      x+xx,yy,z+zz*(td/2+.15),
      b.type==='office'?5.2:3.7,3.8,1,id);

   for(const xx of [-1,1])
    for(let zz=-td/2+5;zz<td/2-2;zz+=8)
     this.part('side',glass,
      x+xx*(tw/2+.15),yy,z+zz,
      1,3.8,b.type==='office'?5.2:4,id);
  }
 }

 for(const a of details.parts){
  this.box(
   a.color,x+a.x,y+a.y,z+a.z,
   a.width,a.height,a.depth,id
  );
 }
 this.box('#536960',x,7,z+d/2+.3,4,6,.6,id);
 if(b.type==='commercial')this.box('#b47c55',x,9,z+d/2+2,w,2,5,id);
 if(b.type==='hospital'){this.box('#b65d4c',x,y+h+2,z,12,1,3,id);this.box('#b65d4c',x,y+h+2,z,3,1,12,id);}
 if(b.type==='school')this.box('#ceab60',x,y+h+2,z,w*.7,2,d*.65,id);
 if(b.type==='civic'){for(let dx=-w/2+3;dx<w/2;dx+=6)this.part('cylinder','#f5ecd9',x+dx,12,z+d/2+2,1.5,16,1.5,id);this.box('#e8dfca',x,21,z+d/2+2,w+3,3,6,id);}
 }

 drawPathRoad(road){

  const {points,width,bridge}=road.path;

  for(let i=1;i<points.length;i++){

   const a=points[i-1];

   const b=points[i];

   const dx=b[0]-a[0];

   const dz=b[1]-a[1];

   const length=Math.hypot(dx,dz);

   const angle=Math.atan2(dx,dz);

   const x=(a[0]+b[0])/2;

   const z=(a[1]+b[1])/2;

   // Each segment overlaps slightly
   // to close gaps along curved roads.

   const segmentLength=length+width*.3;

   this.part(

    'box','#d4d2bc',

    x,3.6,z,

    width+6,1.8,segmentLength,

    road.id,angle
   );

   this.part(

    'box',

    road.visual.color||'#697671',

    x,4.8,z,

    width,.5,segmentLength,

    road.id,angle
   );

   // Centre line along each segment.

   this.part(

    'box','#e0ddc3',

    x,5.1,z,

    .6,.1,Math.min(length*.55,8),

    road.id,angle
   );

   if(bridge&&Math.abs(x)<80){

    const nx=Math.cos(angle);

    const nz=-Math.sin(angle);

    for(const side of [-1,1]){

     const offset=side*(width/2+1);

     this.part(

      'box','#e6dfc8',

      x+nx*offset,7,z+nz*offset,

      1.2,3,segmentLength,

      road.id,angle
     );
    }

    if(i%3===0){

     this.box(

      '#b9baa6',

      x,1.7,z,

      4,6,4,

      road.id
     );
    }
   }

   // Fill joins between segments.

   if(i<points.length-1){

    this.part(

     'cylinder','#697671',

     b[0],4.8,b[1],

     width/2,.5,width/2,

     road.id
    );
   }
  }
 }


 flush(){const dummy=new THREE.Object3D();for(const batch of this.batches.values()){const material=new THREE.MeshStandardMaterial({color:batch.color,roughness:.85,side:['roof','front','side'].includes(batch.shape)?THREE.DoubleSide:THREE.FrontSide});
 material.userData.nightGlow=
  ['front','side'].includes(batch.shape)
   ?'window'
   :batch.color==='#f0dfaf'
    ?'lamp':null;

 const mesh=new THREE.InstancedMesh(this.geometries[batch.shape],material,batch.items.length);mesh.userData.ids=[];batch.items.forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.scale.set(p.w,p.h,p.d);dummy.rotation.set(0,p.rotation,0);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.userData.ids[i]=p.id;});mesh.castShadow=!['front','side'].includes(batch.shape);mesh.receiveShadow=true;mesh.computeBoundingSphere();this.scene.add(mesh);if(mesh.userData.ids.some(Boolean))this.pickables.push(mesh);}this.batches.clear();}

 setDayNight(night){

  this.scene.background.set(
   night?'#111c30':'#e9eee7'
  );

  setLightingMode(this.lights,night);

  this.scene.traverse(object=>{

   const material=object.material;
   const glow=material?.userData?.nightGlow;

   if(!glow)return;

   material.emissive.set(
    night
     ?glow==='lamp'
      ?'#ffcf80':'#ffd393'
     :'#000000'
   );

   material.emissiveIntensity=
    night
     ?glow==='lamp'?1.8:.8
     :0;
  });

  this.renderer.shadowMap.needsUpdate=true;

  this.dirty=true;
  this.onInvalidate?.();
 }

 highlight(building){this.dirty=true;this.onInvalidate?.();if(this.outline){this.scene.remove(this.outline);this.outline.geometry.dispose();this.outline.material.dispose();this.outline=null;}if(!building)return;const {width:w,depth:d,height:h}=building.dimensions;const geo=new THREE.BoxGeometry(w+10,h+12,d+10);this.outline=new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:'#e49b42'}));geo.dispose();this.outline.position.set(building.position.x,4+h/2,building.position.z);this.scene.add(this.outline);}
 resize(container){
 const rect=container.getBoundingClientRect();
 const width=Math.floor(rect.width),height=Math.floor(rect.height);
 if(width<=0||height<=0)return;
 if(width===this.viewportWidth&&height===this.viewportHeight)return;
 this.viewportWidth=width;this.viewportHeight=height;
 this.camera.aspect=width/height;this.camera.updateProjectionMatrix();this.renderer.setSize(width,height);
 this.dirty=true;this.onInvalidate?.();
 }
 render(){this.renderer.render(this.scene,this.camera);this.dirty=false;}
 dispose(){this.observer.disconnect();this.highlight(null);this.scene.traverse(o=>{if(o.isMesh){o.material.dispose();if(o.isInstancedMesh)o.dispose();}});Object.values(this.geometries).forEach(g=>g.dispose());this.renderer.dispose();}
}
