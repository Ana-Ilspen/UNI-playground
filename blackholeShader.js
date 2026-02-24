import blackholeFrag from './blackholeLens.glsl?raw';

export const blackHoleShader = {
  uniforms: {
    tDiffuse: { value: null },
    blackHolePos: { value: new THREE.Vector3(0,0,0) },
    strength: { value: 0.2 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: blackholeFrag
};
