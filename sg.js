import { camera } from './renderer.js';

export function stickToTopPlanet(planet){
  if(!planet) return;
  const offset = new THREE.Vector3(0,planet.mesh.geometry.parameters.radius*3,planet.mesh.geometry.parameters.radius*5);
  camera.position.copy(planet.mesh.position.clone().add(offset));
  camera.lookAt(planet.mesh.position);
}
