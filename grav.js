import * as THREE from "./lib/three.module.js"
import {G,timeScale} from "./constants.js"

export function applyGravity(bodies,dt)
{

for(const a of bodies)
{

for(const b of bodies)
{

if(a===b) continue

const dir =
new THREE.Vector3()
.subVectors(b.position,a.position)

const r = dir.length()

if(r<1) continue

const acc =
dir.normalize()
.multiplyScalar(
(G*b.mass)/(r*r)
)

a.velocity.add(
acc.multiplyScalar(dt*timeScale)
)

}

}

}