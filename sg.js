import * as THREE from "./lib/three.module.js"

export function stickToPlanet(ship,planet)
{

const dir =
new THREE.Vector3()
.subVectors(
ship.position,
planet.position
)

const dist=dir.length()

if(dist < planet.radius+2)
{

dir.normalize()

ship.position.copy(
planet.position.clone()
.add(dir.multiplyScalar(
planet.radius+2))
)

ship.velocity.set(0,0,0)

}

}