console.log("SIM STARTED")
import * as THREE from "../lib/three.module.js"

import {scene,renderer}
from "../renderer.js"

import {input}
from "../input.js"

import {updateCamera}
from "../control.js"

import {applyGravity}
from "../grav.js"

import {applyDrag}
from "../atmo.js"

import {Planet}
from "../planet.js"

import {Ship}
from "../spacecraft.js"

import {BlackHole}
from "../blackhole.js"

import {builder}
from "../builder.js"

import "../info.js"

import {hud}
from "../hud.js"

import {
createGalaxy
}
from "../gb.js"

import {
createGrid,
warpGrid
}
from "../grid.js"

import {
stickToPlanet
}
from "../sg.js"


createGalaxy()

const grid=createGrid()

const planets=[]

const ship=new Ship()

const blackHole =
new BlackHole(
new THREE.Vector3(200,0,0),
500000,
10
)

builder((mass,radius)=>{

const p=new Planet({

mass,

radius,

position:
new THREE.Vector3(
Math.random()*200-100,
0,
Math.random()*200-100
),

velocity:new THREE.Vector3()

})

planets.push(p)

})


function loop()
{

requestAnimationFrame(loop)

const bodies=
[ship,blackHole,...planets]

applyGravity(bodies,.016)

ship.update(input,.016)

blackHole.update()

for(const p of planets)
{

applyDrag(ship,p)

stickToPlanet(ship,p)

p.update(.016)

}

warpGrid(grid,bodies)

updateCamera(ship.position)

hud(ship)

renderer.render(scene,
updateCamera)

}

loop()








