import {objects} from "./main.js";

const G=6.674e-11;

export function updateGravity(){

for(let a of objects){

for(let b of objects){

if(a===b)continue;

let dx=b.position.x-a.position.x;
let dy=b.position.y-a.position.y;
let dz=b.position.z-a.position.z;

let dist=Math.sqrt(dx*dx+dy*dy+dz*dz)+1;

let force=G*a.userData.mass*b.userData.mass/(dist*dist);

}
}
}
