import * as THREE from "/lib/three.module.js"
import {scene} from "../renderer.js"

export class BlackHole
{

constructor(position,mass,radius)
{

this.mass=mass
this.radius=radius

this.position=position
this.velocity=new THREE.Vector3()

this.mesh =
new THREE.Mesh(

new THREE.SphereGeometry(radius,64,64),

new THREE.MeshBasicMaterial({
color:0x000000
})

)

scene.add(this.mesh)

const glow =
new THREE.Mesh(

new THREE.SphereGeometry(radius*1.5,64,64),

new THREE.MeshBasicMaterial({
color:0x4400ff,
transparent:true,
opacity:.3
})

)

scene.add(glow)

this.glow=glow

}

update()
{

this.mesh.position.copy(this.position)
this.glow.position.copy(this.position)

}


}
