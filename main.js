import { updatePhysics } from './grav.js';
import { renderer, camera } from './renderer.js';
import { setupCameraControls } from './control.js';
import { bodies } from './constants.js';

setupCameraControls();

function animate(){
  requestAnimationFrame(animate);
  updatePhysics();
  renderer.render(camera.parent || camera, camera);
}

animate();

window.addEventListener('resize',()=>{
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
});
