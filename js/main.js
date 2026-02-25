import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js";

window.THREE=THREE;

export const scene=new THREE.Scene();

export const camera=new THREE.PerspectiveCamera(
60,
window.innerWidth/window.innerHeight,
0.1,
1e12
);

camera.position.set(0,50000,100000);

export const renderer=new THREE.WebGLRenderer({

canvas:document.getElementById("scene"),
antialias:true

});

renderer.setSize(window.innerWidth,window.innerHeight);

const light=new THREE.PointLight(0xffffff,2);

scene.add(light);

export const objects=[];

function animate(){

requestAnimationFrame(animate);

renderer.render(scene,camera);

}

animate();
