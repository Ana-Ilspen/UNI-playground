import { camera, renderer } from './renderer.js';

export let dragging=false, px, py;

export function setupCameraControls(){
  renderer.domElement.onmousedown=e=>{dragging=true; px=e.clientX; py=e.clientY;};
  renderer.domElement.onmouseup=()=>dragging=false;
  renderer.domElement.onmousemove=e=>{
    if(!dragging) return;
    const dx=e.clientX-px, dy=e.clientY-py;
    camera.position.applyAxisAngle(new THREE.Vector3(0,1,0), -dx*0.005);
    camera.position.y += dy;
    camera.lookAt(0,0,0);
    px=e.clientX; py=e.clientY;
  };
  renderer.domElement.onwheel=e=>{
    camera.position.multiplyScalar(1+e.deltaY*0.001);
  };
}
