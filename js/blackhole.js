import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// Fully inlined GLSL shader — no external .glsl file
export const blackHoleShader = {
  uniforms: {
    tDiffuse: { value: null },
    blackHolePos: { value: new THREE.Vector3(0, 0, 0) },
    strength: { value: 0.25 } // adjust lensing strength
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
      // Transform UV to center
      vec2 uv = vUv - vec2(0.5);

      // Distance from center (r)
      float r = length(uv);

      // Radial distortion for lensing
      uv -= uv * strength / (r*r + 0.001);

      // Sample the scene texture
      vec4 color = texture2D(tDiffuse, uv + vec2(0.5));

      // Output color
      gl_FragColor = color;
    }
  `
};
