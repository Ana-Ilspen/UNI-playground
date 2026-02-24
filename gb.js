import { scene } from './constants.js';
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const starGeo = new THREE.BufferGeometry();
const starCount = 10000;
const positions = [];
for(let i=0;i<starCount;i++){
  positions.push(Math.random()*2000-1000, Math.random()*2000-1000, Math.random()*2000-1000);
}
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions,3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({color:0xffffff}));
scene.add(stars);
