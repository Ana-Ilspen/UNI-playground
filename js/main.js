import { renderer, camera, scene } from './renderer.js';
import { updatePhysics } from './grav.js';
import { setupCameraControls } from './control.js';
import { bodies } from './constants.js';
import { checkCollisions } from './coll.js';
import { createHUD, updateHUD } from './hud.js';
import { setupInput } from './input.js';
import { createBlackHole } from './blackhole.js';
import { stickToTopPlanet } from './sg.js';
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { EffectComposer } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/ShaderPass.js';
import { blackHoleShader } from './blackholeShader.js'; // Wrap GLSL in JS export

// --- Camera controls ---
setupCameraControls();
setupInput();

// --- HUD ---
const hud = createHUD();

// --- Post-processing for black hole lensing ---
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene,camera));

const lensPass = new ShaderPass(blackHoleShader);
lensPass.uniforms.strength.value = 0.25; // adjust for intensity
composer.addPass(lensPass);

// --- Animation loop ---
function animate(){
  requestAnimationFrame(animate);

  // 1. Update physics
  updatePhysics();

  // 2. Collision detection
  checkCollisions();

  // 3. Update HUD
  const selected = bodies.find(b=>b.type==="planet"); // placeholder for selected body
  updateHUD(hud,camera,selected);

  // 4. Stick camera to top planet if needed
  // stickToTopPlanet(selected);

  // 5. Render scene with postprocessing
  composer.render();
}

animate();

// --- Resize ---
window.addEventListener('resize',()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
  composer.setSize(window.innerWidth,window.innerHeight);
});
