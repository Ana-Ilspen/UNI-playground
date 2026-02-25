import {scene,camera,renderer} from "./main.js";

export function createBlackHole(radius){

const geo=new THREE.SphereGeometry(radius,64,64);

const mat=new THREE.ShaderMaterial({

uniforms:{
time:{value:0}
},

vertexShader:`

varying vec3 vNormal;

void main(){

vNormal=normal;

gl_Position=
projectionMatrix*
modelViewMatrix*
vec4(position,1.0);

}
`,

fragmentShader:`

varying vec3 vNormal;

void main(){

float intensity=
pow(0.6-dot(vNormal,vec3(0,0,1.0)),3.0);

vec3 color=
vec3(0.0,0.0,0.0)+
vec3(0.3,0.0,0.5)*intensity;

gl_FragColor=
vec4(color,1.0);

}

`

});

const mesh=new THREE.Mesh(geo,mat);

scene.add(mesh);

return mesh;

}
