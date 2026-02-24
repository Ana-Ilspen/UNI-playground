import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { bodies, scene } from './constants.js';

export function createBlackHole(pos){
  const radius=10;
  const mesh=new THREE.Mesh(
    new THREE.SphereGeometry(radius,32,32),
    new THREE.MeshBasicMaterial({color:0x000000})
  );
  mesh.position.copy(pos);
  scene.add(mesh);
  const disk=new THREE.Mesh(
    new THREE.TorusGeometry(radius*2,3,16,100),
    new THREE.MeshBasicMaterial({color:0xffaa00})
  );
  disk.rotation.x=Math.PI/2;
  mesh.add(disk);
  bodies.push({mesh,mass:100000,velocity:new THREE.Vector3(),type:'blackhole'});
}

export function createBlackHoleUI(){
  createBlackHole(new THREE.Vector3(Math.random()*400-200,0,Math.random()*400-200));
}
