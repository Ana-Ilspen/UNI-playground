import { camera } from './renderer.js';

export function warp(){
  camera.position.set(Math.random()*2000, Math.random()*1000, Math.random()*2000);
}
