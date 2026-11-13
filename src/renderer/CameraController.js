import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
export class CameraController {
 constructor(camera,canvas){this.camera=camera;this.controls=new OrbitControls(camera,canvas);this.controls.enableDamping=true;this.controls.listenToKeyEvents(window);this.controls.dampingFactor=.075;this.controls.minDistance=80;this.controls.maxDistance=6000;this.controls.maxPolarAngle=Math.PI/2.12;this.controls.screenSpacePanning=false;this.reset();}
 reset(){this.top=false;this.controls.target.set(0,0,0);this.camera.position.set(1250,1250,1500).multiplyScalar(Math.max(1,1.3/this.camera.aspect));this.controls.update();}
 toggleTop(){if(this.top){this.reset();return;}this.top=true;this.controls.target.set(0,0,0);this.camera.position.set(0,2100/Math.min(1,this.camera.aspect),0.1);this.controls.update();}
 update(delta){const changed=this.controls.update(delta);const t=this.controls.target;const clamped=new THREE.Vector3(THREE.MathUtils.clamp(t.x,-650,650),THREE.MathUtils.clamp(t.y,0,150),THREE.MathUtils.clamp(t.z,-650,650));this.camera.position.add(clamped.clone().sub(t));t.copy(clamped);return changed;}
 dispose(){this.controls.dispose();}
}
