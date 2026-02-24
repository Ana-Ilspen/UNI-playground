import { bodies } from './constants.js';

export function checkCollisions(){
  for(let a of bodies){
    if(a.type!=="planet" && a.type!=="spacecraft") continue;
    for(let b of bodies){
      if(a===b) continue;
      const dist = a.mesh.position.distanceTo(b.mesh.position);
      const minDist = (a.mesh.geometry.parameters.radius || 1) + (b.mesh.geometry.parameters.radius || 1);
      if(dist < minDist){
        // Simple collision response: stop velocity
        a.velocity.set(0,0,0);
        b.velocity.set(0,0,0);
      }
    }
  }
}
