import * as THREE from "../lib/three.module.js";

export function createBlackHoleMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float glow = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
        vec3 color = vec3(0.0) + vec3(0.5, 0.1, 0.8) * glow;
        gl_FragColor = vec4(color, 1.0);
      }
    `
  });
}
