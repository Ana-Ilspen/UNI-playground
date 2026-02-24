import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { G, bodies } from './constants.js';

export function updatePhysics(){
  for(let a of bodies){
    for(let b of bodies){
      if(a===b) continue;
      const dir=new THREE.Vector3().subVectors(b.mesh.position,a.mesh.position);
      const dist=dir.length()+1;
      const force=(G*a.mass*b.mass)/(dist*dist);
      dir.normalize();
      a.velocity.add(dir.multiplyScalar(force/a.mass));
    }
  }
  for(let b of bodies) b.mesh.position.add(b.velocity);
}
