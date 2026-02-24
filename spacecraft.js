import * as THREE from "./lib/three.module.js"
import {scene,camera} from "./renderer.js"

export class Ship
{

constructor()
{

this.mass=1000

this.position =
new THREE.Vector3(0,0,50)

this.velocity =
new THREE.Vector3()

this.mesh =
new THREE.Mesh(

new THREE.ConeGeometry(1,4,16),

new THREE.MeshStandardMaterial({
color:0xffffff
})

)

scene.add(this.mesh)

}

update(input,dt)
{

const thrust = .05

if(input.forward)
this.velocity.z -= thrust

if(input.back)
this.velocity.z += thrust

if(input.left)
this.velocity.x -= thrust

if(input.right)
this.velocity.x += thrust

if(input.boost)
this.velocity.multiplyScalar(1.02)

if(input.hyper)
this.velocity.multiplyScalar(1.2)

this.position.add(
this.velocity.clone().multiplyScalar(dt)
)

this.mesh.position.copy(this.position)

camera.position.lerp(
this.position.clone().add(
new THREE.Vector3(0,10,25)
),.1)

camera.lookAt(this.position)

}

}