import * as THREE from "/lib/three.module.js"
import {scene} from "./renderer.js"
import {terrain} from "./terrain.js"

export class Planet
{

constructor(data)
{

this.mass=data.mass

this.radius=data.radius

this.position=data.position

this.velocity=data.velocity

this.mesh =
new THREE.Mesh(

terrain(this.radius),

new THREE.MeshStandardMaterial({
color:data.color||0x3399ff
})

)

scene.add(this.mesh)

}

update(dt)
{

this.position.add(
this.velocity.clone().multiplyScalar(dt)
)

this.mesh.position.copy(this.position)

}


}
