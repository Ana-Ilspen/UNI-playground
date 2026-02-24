import { warp } from './hps.js';
import { camera } from './renderer.js';

export function setupInput(){
  window.addEventListener('keydown',e=>{
    switch(e.key){
      case 'w': camera.position.z -= 10; break;
      case 's': camera.position.z += 10; break;
      case 'a': camera.position.x -= 10; break;
      case 'd': camera.position.x += 10; break;
      case ' ': warp(); break;
    }
  });
}
