import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function addAtmosphere(planetMesh, radius){
  const atmMesh=new THREE.Mesh(
    new THREE.SphereGeometry(radius*1.15,32,32),
    new THREE.MeshBasicMaterial({color:0x66aaff,transparent:true,opacity:0.2})
  );
  planetMesh.add(atmMesh);
}
