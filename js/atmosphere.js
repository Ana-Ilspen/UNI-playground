import * as THREE from "../lib/three.module.js";

export function addAtmosphere(mesh) {
  const radius = mesh.geometry.parameters.radius;
  const geo = new THREE.SphereGeometry(radius * 1.06, 32, 32);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x77b6ff,
    transparent: true,
    opacity: 0.18,
    side: THREE.BackSide
  });
  const atmosphere = new THREE.Mesh(geo, mat);
  mesh.add(atmosphere);
}
