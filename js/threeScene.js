import * as THREE from "three"

export let scene,camera,renderer

export function initScene(){

scene=new THREE.Scene()

camera=new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
.1,
1000
)

camera.position.z=50


renderer=new THREE.WebGLRenderer({
canvas:document.getElementById("universeCanvas"),
antialias:true
})

renderer.setSize(
window.innerWidth,
window.innerHeight
)


animate()

}


function animate(){

requestAnimationFrame(animate)

renderer.render(scene,camera)

}
