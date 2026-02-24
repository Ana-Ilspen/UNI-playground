import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { scene, bodies } from './constants.js';

export function createSpacecraft(pos){
  const geo = new THREE.ConeGeometry(2,6,8);
  const mat = new THREE.MeshStandardMaterial({color:0xff0000});
  const mesh = new THREE.Mesh(geo,mat);
  mesh.position.copy(pos);
  scene.add(mesh);
  bodies.push({mesh,mass:5,velocity:new THREE.Vector3(),type:'spacecraft'});
  return mesh;
}
