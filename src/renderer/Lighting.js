import * as THREE from 'three';
export function addLighting(scene) {
 const hemisphere=new THREE.HemisphereLight(
  0xf6f7e7,0x849583,2.5
 );
 scene.add(hemisphere);
 const sun=new THREE.DirectionalLight(0xfff0d5,3.2);sun.position.set(-400,850,350);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
 Object.assign(sun.shadow.camera,{left:-850,right:850,top:850,bottom:-850,near:10,far:1800});sun.shadow.bias=-.0004;sun.shadow.normalBias=1.5;scene.add(sun);
 return {hemisphere,sun};
}

export function setLightingMode(lights,night){

 const {hemisphere,sun}=lights;

 hemisphere.color.setHex(
  night?0x718db8:0xf6f7e7
 );

 hemisphere.groundColor.setHex(
  night?0x39475e:0x849583
 );

 hemisphere.intensity=night?.65:2.5;

 sun.color.setHex(
  night?0x9eb9ed:0xfff0d5
 );

 sun.intensity=night?.85:3.2;

 sun.castShadow=!night;
}
