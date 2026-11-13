import * as THREE from 'three';
export function addLighting(scene) {
 scene.add(new THREE.HemisphereLight(0xf6f7e7,0x849583,2.5));
 const sun=new THREE.DirectionalLight(0xfff0d5,3.2);sun.position.set(-400,850,350);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
 Object.assign(sun.shadow.camera,{left:-850,right:850,top:850,bottom:-850,near:10,far:1800});sun.shadow.bias=-.0004;sun.shadow.normalBias=1.5;scene.add(sun);
}
