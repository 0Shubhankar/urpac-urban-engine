import * as THREE from 'three';
import {addLighting} from './Lighting.js';
// All static details are grouped by geometry/material into instanced batches.
export class CityRenderer {
 constructor(container,state){
 this.state=state;this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#e9eee7');
 this.camera=new THREE.PerspectiveCamera(38,1,2,6500);
 this.renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.autoUpdate=false;this.renderer.shadowMap.needsUpdate=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;container.appendChild(this.renderer.domElement);
 this.geometries={front:new THREE.PlaneGeometry(1,1),side:new THREE.PlaneGeometry(1,1).rotateY(Math.PI/2),box:new THREE.BoxGeometry(1,1,1),cone:new THREE.ConeGeometry(1,1,7),sphere:new THREE.IcosahedronGeometry(1,1),cylinder:new THREE.CylinderGeometry(1,1,1,8)};const roof=new THREE.BufferGeometry();roof.setAttribute('position',new THREE.Float32BufferAttribute([-.5,0,-.5,.5,0,-.5,0,1,-.5, -.5,0,.5,0,1,.5,.5,0,.5, -.5,0,-.5,0,1,-.5,0,1,.5, -.5,0,-.5,0,1,.5,-.5,0,.5, .5,0,-.5,.5,0,.5,0,1,.5, .5,0,-.5,0,1,.5,0,1,-.5],3));roof.computeVertexNormals();this.geometries.roof=roof;this.batches=new Map();this.pickables=[];addLighting(this.scene);this.build();this.flush();
 this.observer=new ResizeObserver(()=>this.resize(container));this.observer.observe(container);this.resize(container);
 }
 part(shape,color,x,y,z,w,h,d,id=null,rotation=0){const key=`${shape}:${color}`;if(!this.batches.has(key))this.batches.set(key,{shape,color,items:[]});this.batches.get(key).items.push({x,y,z,w,h,d,id,rotation});}
 box(color,x,y,z,w,h,d,id=null){this.part('box',color,x,y,z,w,h,d,id);}
 build(){const s=this.state;
 this.box('#8d9c7f',0,-15,0,1210,25,1210);this.box('#b2c497',0,-1,0,1200,8,1200);
 // A recessed river and a raised, continuous riverside promenade.
 this.box('#68a9ad',0,3,0,110,1,1200);
 for(const x of [-59,59])this.box('#c6c7ac',x,4,0,8,5,1200);
 for(const x of [-74,74])this.box('#dbd7bf',x,3,0,20,2,1200);
 for(let z=-570;z<600;z+=52)this.box('#92c1bd',0,3.6,z,65,0.1,1.2);
 for(const r of s.roads){const {x,z}=r.position,{width:w,depth:d}=r.dimensions;this.box('#d4d2bc',x,3,z,w+9,2,d+9);this.box('#6f7b75',x,4.1,z,w,.3,d);
 if(w<100){for(let k=-520;k<540;k+=25)if(!s.roads.some(q=>q.dimensions.width>100&&Math.abs(q.position.z-k)<20))this.box('#d8d7ba',x,4.4,k,1,.1,10);}else{for(let k=-520;k<540;k+=25)if(!s.roads.some(q=>q.dimensions.width<100&&Math.abs(q.position.x-k)<20))this.box('#d8d7ba',k,4.4,z,10,.1,1);}}
 for(const b of s.bridges){const z=b.position.z,d=b.dimensions.depth;for(const dz of [-d/2-2,d/2+2]){this.box('#e6dfc8',0,7,z+dz,152,3,2);for(const x of [-48,48])this.box('#b9baa6',x,2,z+dz,5,8,5);}}
 for(const p of s.parks){const {x,z}=p.position;this.box('#97b67f',x,3,z,145,1,145);this.box('#ded5b6',x,4,z,140,.5,7);this.box('#ded5b6',x,4,z,7,.5,140);this.part('cylinder','#d5d7c3',x,4.5,z,13,2,13);this.part('cylinder','#7fb4b2',x,5.7,z,10,.5,10);}
 // Gentle landscaped relief is limited to the outer boundary, away from plots.
 for(const x of [-580,580])for(const z of [-400,-100,200,420])this.part('sphere','#a7bd8d',x,0,z,20,9,65);
 for(const b of s.buildings)this.building(b);
 for(const t of s.trees){const {x,z}=t.position,h=t.dimensions.height,w=t.dimensions.width;this.part('cylinder','#8b8164',x,6,z,1.5,8,1.5);this.part('sphere',t.visual.color,x,h*.65+5,z,w,h*.48,w);}
 }
 building(b){const {x,z}=b.position,{width:w,depth:d,height:h}=b.dimensions,id=b.id,y=4;
 this.box('#c9c7ad',x,3,z,w+7,1,d+7,id);this.box(b.visual.color,x,y+h/2,z,w,h,d,id);
 if(b.type==='house') {this.part('roof',b.visual.roof,x,y+h,z,w+4,9,d+4,id);this.box('#eee2c9',x+w*.25,y+h+4,z,3,9,3,id);}
 else{this.box('#f1ead8',x,y+h,z,w+2,1.6,d+2,id);this.box(b.visual.roof,x,y+h+1,z,w-3,1,d-3,id);this.box('#b6b5a4',x+3,y+h+3,z,8,4,7,id);}
 const glass=b.type==='office'?'#526e70':'#687d79';
 for(let yy=9;yy<h+1;yy+=b.type==='office'?9:8){for(const zz of [-1,1])for(let xx=-w/2+5;xx<w/2-2;xx+=7)this.part('front',glass,x+xx,yy,z+zz*(d/2+.15),3.7,3.8,1,id);for(const xx of [-1,1])for(let zz=-d/2+5;zz<d/2-2;zz+=8)this.part('side',glass,x+xx*(w/2+.15),yy,z+zz,1,3.8,4,id);}
 this.box('#536960',x,7,z+d/2+.3,4,6,.6,id);
 if(b.type==='commercial')this.box('#b47c55',x,9,z+d/2+2,w,2,5,id);
 if(b.type==='hospital'){this.box('#b65d4c',x,y+h+2,z,12,1,3,id);this.box('#b65d4c',x,y+h+2,z,3,1,12,id);}
 if(b.type==='school')this.box('#ceab60',x,y+h+2,z,w*.7,2,d*.65,id);
 if(b.type==='civic'){for(let dx=-w/2+3;dx<w/2;dx+=6)this.part('cylinder','#f5ecd9',x+dx,12,z+d/2+2,1.5,16,1.5,id);this.box('#e8dfca',x,21,z+d/2+2,w+3,3,6,id);}
 }
 flush(){const dummy=new THREE.Object3D();for(const batch of this.batches.values()){const material=new THREE.MeshStandardMaterial({color:batch.color,roughness:.85,side:['roof','front','side'].includes(batch.shape)?THREE.DoubleSide:THREE.FrontSide});const mesh=new THREE.InstancedMesh(this.geometries[batch.shape],material,batch.items.length);mesh.userData.ids=[];batch.items.forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.scale.set(p.w,p.h,p.d);dummy.rotation.set(0,p.rotation,0);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.userData.ids[i]=p.id;});mesh.castShadow=!['front','side'].includes(batch.shape);mesh.receiveShadow=true;mesh.computeBoundingSphere();this.scene.add(mesh);if(mesh.userData.ids.some(Boolean))this.pickables.push(mesh);}this.batches.clear();}
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
