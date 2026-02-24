import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { scene } from './constants.js';

const gridHelper = new THREE.GridHelper(1000,50,0x444444,0x222222);
scene.add(gridHelper);
