import * as THREE from "/lib/three.module.js"
import {scene} from "./renderer.js"

export function createGalaxy()
{

const geo=new THREE.BufferGeometry()

const verts=[]

for(let i=0;i<10000;i++)
{

verts.push(
(Math.random()-.5)*5000,
(Math.random()-.5)*5000,
(Math.random()-.5)*5000
)

}

geo.setAttribute(
"position",
new THREE.Float32BufferAttribute(
verts,3)
)

const mat =
new THREE.PointsMaterial({
color:0xffffff,
size:1
})

const stars =
new THREE.Points(geo,mat)

scene.add(stars)


}
