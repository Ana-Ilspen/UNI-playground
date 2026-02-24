import * as THREE from "/lib/three.module.js"
import {scene} from "./renderer.js"

export function createGrid()
{

const size=500
const div=100

const geo =
new THREE.PlaneGeometry(
size,
size,
div,
div
)

const mat =
new THREE.MeshBasicMaterial({
color:0x0044ff,
wireframe:true
})

const grid =
new THREE.Mesh(geo,mat)

grid.rotation.x=-Math.PI/2

scene.add(grid)

return grid

}

export function warpGrid(grid,bodies)
{

const pos =
grid.geometry.attributes.position

for(let i=0;i<pos.count;i++)
{

let x=pos.getX(i)
let z=pos.getZ(i)

let y=0

for(const b of bodies)
{

const dx=x-b.position.x
const dz=z-b.position.z

const d=Math.sqrt(dx*dx+dz*dz)

y -= b.mass/(d+50)*0.0001

}

pos.setY(i,y)

}

pos.needsUpdate=true


}
