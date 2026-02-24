import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { bodies, scene } from './constants.js';
import { applyTerrain } from './terrain.js';
import { addAtmosphere } from './atmo.js';

export function createPlanet(radius,mass,pos,vel,atm,terrainRough){
  const geo=new THREE.SphereGeometry(radius,64,64);
  applyTerrain(geo,terrainRough);
  const mat=new THREE.MeshStandardMaterial({color:new THREE.Color(Math.random(),Math.random(),Math.random())});
  const mesh=new THREE.Mesh(geo,mat);
  mesh.position.copy(pos);
  scene.add(mesh);
  if(atm>0) addAtmosphere(mesh,radius);
  bodies.push({mesh,mass,velocity:vel,type:'planet'});
}
