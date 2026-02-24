import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { scene } from './constants.js';

export const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 10000000);
camera.position.set(0,300,600);

export const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);
document.body.appendChild(renderer.domElement);
