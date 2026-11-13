
import * as THREE from 'three';

import {
 streetLamps,activityRoutes,
 routeLength,routePosition
} from '../generators/StreetLife.js';

const LEVELS={
 off:[0,0],
 low:[15,12],
 normal:[30,24],
 high:[60,40]
};

export class UrbanActivity{

 constructor(view){

  this.view=view;
  this.time=0;
  this.paused=false;

  this.routes=activityRoutes(view.state);

  this.dummy=new THREE.Object3D();
  this.meshes=[];

  this.carBodies=this.mesh(
   view.geometries.box,60,'#ffffff'
  );

  this.carRoofs=this.mesh(
   view.geometries.box,60,'#748d92'
  );

  this.peopleBodies=this.mesh(
   view.geometries.box,40,'#ffffff'
  );

  this.peopleHeads=this.mesh(
   view.geometries.sphere,40,'#c99d7b'
  );

  const palette=[
   '#b95c4e','#d4d8d2','#547a91',
   '#b7a160','#557266','#353e48'
  ];

  for(let i=0;i<60;i++){

   this.carBodies.setColorAt(
    i,new THREE.Color(palette[i%palette.length])
   );
  }

  for(let i=0;i<40;i++){

   this.peopleBodies.setColorAt(
    i,new THREE.Color(
     palette[(i+2)%palette.length]
    )
   );
  }

  this.carBodies.instanceColor.needsUpdate=true;
  this.peopleBodies.instanceColor.needsUpdate=true;

  this.createLightPools();
  this.createVehicleLights();
  this.setLevel('normal');
 }

 mesh(geometry,max,color){

  const material=new THREE.MeshStandardMaterial({
   color,roughness:.8
  });

  const mesh=new THREE.InstancedMesh(
   geometry,material,max
  );

  mesh.instanceMatrix.setUsage(
   THREE.DynamicDrawUsage
  );

  mesh.frustumCulled=false;
  mesh.castShadow=false;
  mesh.receiveShadow=true;
  mesh.count=0;

  this.view.scene.add(mesh);
  this.meshes.push(mesh);

  return mesh;
 }

 createVehicleLights(){

  this.night=false;

  this.headlights=this.mesh(
   this.view.geometries.box,120,'#fff1cb'
  );

  this.taillights=this.mesh(
   this.view.geometries.box,120,'#ff3025'
  );

  this.headlights.material.emissive.set('#fff1cb');
  this.headlights.material.emissiveIntensity=3;

  this.taillights.material.emissive.set('#ff3025');
  this.taillights.material.emissiveIntensity=2.5;

  // Reuse the procedural road-light texture.

  this.headlightBeams=this.mesh(
   this.lightGeometry,60,'#ffffff'
  );

  this.headlightBeams.material.dispose();

  this.headlightBeams.material=
   new THREE.MeshBasicMaterial({
    map:this.lightTexture,
    color:'#fff4d9',
    transparent:true,
    opacity:.75,
    depthWrite:false,
    blending:THREE.AdditiveBlending,
    toneMapped:false
   });

  this.headlights.visible=false;
  this.taillights.visible=false;
  this.headlightBeams.visible=false;
 }

 createLightPools(){

  const n=64;
  const data=new Uint8Array(n*n*4);

  for(let y=0;y<n;y++){

   for(let x=0;x<n;x++){

    const radius=Math.hypot(
     (x-(n-1)/2)/(n/2),
     (y-(n-1)/2)/(n/2)
    );

    const alpha=Math.max(0,1-radius)**2;

    const i=(y*n+x)*4;

    data[i]=255;
    data[i+1]=210;
    data[i+2]=135;
    data[i+3]=Math.round(alpha*255);
   }
  }

  this.lightTexture=new THREE.DataTexture(
   data,n,n
  );

  this.lightTexture.magFilter=THREE.LinearFilter;
  this.lightTexture.minFilter=THREE.LinearFilter;
  this.lightTexture.needsUpdate=true;

  this.lightGeometry=new THREE.PlaneGeometry(
   1,1
  ).rotateX(-Math.PI/2);

  const material=new THREE.MeshBasicMaterial({
   map:this.lightTexture,
   transparent:true,
   opacity:.65,
   depthWrite:false,
   blending:THREE.AdditiveBlending,
   toneMapped:false
  });

  const lamps=streetLamps(this.view.state);

  this.pools=new THREE.InstancedMesh(
   this.lightGeometry,material,lamps.length
  );

  lamps.forEach((l,i)=>{

   this.matrix(
    this.pools,i,
    l.x+l.dx*6,4.48,l.z+l.dz*6,
    24,1,24,0
   );
  });

  this.pools.instanceMatrix.needsUpdate=true;
  this.pools.computeBoundingSphere();
  this.pools.visible=false;

  this.view.scene.add(this.pools);
 }

 matrix(mesh,i,x,y,z,w,h,d,rotation){

  this.dummy.position.set(x,y,z);
  this.dummy.scale.set(w,h,d);
  this.dummy.rotation.set(0,rotation,0);
  this.dummy.updateMatrix();

  mesh.setMatrixAt(i,this.dummy.matrix);
 }

 setNight(night){

  this.pools.visible=night;

  this.night=night;
  this.headlights.visible=night;
  this.taillights.visible=night;
  this.headlightBeams.visible=night;

  this.update(0,true);
  this.view.dirty=true;
 }

 setLevel(level){

  this.level=Object.hasOwn(LEVELS,level)
   ?level:'normal';

  let [cars,people]=LEVELS[this.level];

  if(!this.routes.cars.length)cars=0;
  if(!this.routes.walkers.length)people=0;

  this.carBodies.count=cars;
  this.carRoofs.count=cars;

  this.headlights.count=cars*2;
  this.taillights.count=cars*2;
  this.headlightBeams.count=cars;

  this.peopleBodies.count=people;
  this.peopleHeads.count=people;

  this.view.dirty=true;
  this.update(0,true);
 }

 update(delta,force=false){

  if(this.paused&&!force)return false;

  const cars=this.carBodies.count;
  const people=this.peopleBodies.count;

  if(!cars&&!people)return false;

  this.time+=delta;

  const carRoutes=this.routes.cars;

  for(let i=0;i<cars;i++){

   const index=i%carRoutes.length;
   const route=carRoutes[index];

   const offset=Math.floor(
    i/carRoutes.length
   )*routeLength(route)/
    Math.ceil(cars/carRoutes.length);

   // Equal speeds on the same route.
   const speed=14+(index%5);

   const p=routePosition(
    route,this.time*speed+offset
   );

   this.matrix(
    this.carBodies,i,p.x,5.6,p.z,
    3,2.2,6.2,p.angle
   );

   this.matrix(
    this.carRoofs,i,p.x,7,p.z,
    2.4,1.1,3.4,p.angle
   );

   // Forward and lateral direction vectors.

   const fx=Math.sin(p.angle);
   const fz=Math.cos(p.angle);

   const rx=Math.cos(p.angle);
   const rz=-Math.sin(p.angle);

   if(this.night){

    for(let side=0;side<2;side++){

     const lateral=side===0?-.95:.95;
     const index=i*2+side;

     // Two forward-facing headlights.

     this.matrix(
      this.headlights,index,
      p.x+fx*3.15+rx*lateral,
      5.8,
      p.z+fz*3.15+rz*lateral,
      .65,.5,.25,p.angle
     );

     // Two rear-facing red taillights.

     this.matrix(
      this.taillights,index,
      p.x-fx*3.15+rx*lateral,
      5.8,
      p.z-fz*3.15+rz*lateral,
      .65,.5,.25,p.angle
     );
    }

    // Simulated road illumination ahead.

    this.matrix(
     this.headlightBeams,i,
     p.x+fx*10,4.49,
     p.z+fz*10,
     8,1,19,p.angle
    );
   }
  }

  const walkRoutes=this.routes.walkers;

  for(let i=0;i<people;i++){

   const index=i%walkRoutes.length;
   const route=walkRoutes[index];

   const offset=Math.floor(
    i/walkRoutes.length
   )*routeLength(route)/
    Math.ceil(people/walkRoutes.length);

   const p=routePosition(
    route,this.time*(1.5+index%3*.15)+offset
   );

   this.matrix(
    this.peopleBodies,i,p.x,5.15,p.z,
    .85,1.8,.65,p.angle
   );

   this.matrix(
    this.peopleHeads,i,p.x,6.3,p.z,
    .28,.28,.28,p.angle
   );
  }

  for(const mesh of this.meshes)
   mesh.instanceMatrix.needsUpdate=true;

  return true;
 }

 dispose(){

  for(const mesh of this.meshes){

   this.view.scene.remove(mesh);
   mesh.material.dispose();
   mesh.dispose();
  }

  this.view.scene.remove(this.pools);

  this.pools.material.dispose();
  this.pools.dispose();

  this.lightGeometry.dispose();
  this.lightTexture.dispose();
 }
}
