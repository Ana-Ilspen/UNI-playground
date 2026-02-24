import {camera} from "./renderer.js"

let isDragging=false
let prevX=0
let prevY=0

let rotX=0
let rotY=0
let distance=60

document.addEventListener("mousedown",e=>{
isDragging=true
prevX=e.clientX
prevY=e.clientY
})

document.addEventListener("mouseup",()=>{
isDragging=false
})

document.addEventListener("mousemove",e=>{

if(!isDragging) return

const dx=e.clientX-prevX
const dy=e.clientY-prevY

rotY+=dx*0.005
rotX+=dy*0.005

prevX=e.clientX
prevY=e.clientY

})

document.addEventListener("wheel",e=>{

distance+=e.deltaY*0.05

if(distance<10) distance=10
if(distance>500) distance=500

})

export function updateCamera(target)
{

camera.position.x =
target.x +
Math.sin(rotY)*distance

camera.position.z =
target.z +
Math.cos(rotY)*distance

camera.position.y =
target.y +
rotX*distance*0.5

camera.lookAt(target)

}