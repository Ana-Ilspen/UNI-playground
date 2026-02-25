import * as THREE from "three"
import {scene,camera,renderer} from "./threeScene.js"

export function spawnObject(data){

const geo=new THREE.SphereGeometry(data.radius,32,32)

const mat=new THREE.MeshBasicMaterial({
color:data.color
})

const mesh=new THREE.Mesh(geo,mat)

mesh.position.set(

(Math.random()-.5)*50,
(Math.random()-.5)*50,
(Math.random()-.5)*50

)

scene.add(mesh)

}
