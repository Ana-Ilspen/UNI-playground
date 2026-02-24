import * as THREE from "/lib/three.module.js"

export const scene = new THREE.Scene()

export const camera =
new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000000
)

camera.position.set(0,20,60)

export const renderer =
new THREE.WebGLRenderer({
canvas:document.getElementById("canvas"),
antialias:true
})

renderer.setSize(
window.innerWidth,
window.innerHeight
)

const light =
new THREE.PointLight(0xffffff,2)

scene.add(light)

scene.add(
new THREE.AmbientLight(0xffffff,.3)

)
