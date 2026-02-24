// js/blackholeShader.js
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const blackHoleShader = {
  uniforms: {
    tDiffuse: { value: null },
    blackHolePos: { value: new THREE.Vector3(0, 0, 0) },
    strength: { value: 0.25 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float strength;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv - vec2(0.5);
      float r = length(uv);
      uv -= uv * strength / (r*r + 0.001);
      gl_FragColor = texture2D(tDiffuse, uv + vec2(0.5));
    }
  `
};
