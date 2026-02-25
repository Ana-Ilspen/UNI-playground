import {scene,objects} from "./main.js";

const G=6.674e-11;

export function showOrbit(object){

if(object.orbitLine)
scene.remove(object.orbitLine);

const points=[];

let pos=object.position.clone();
let vel=object.velocity?
object.velocity.clone():
new THREE.Vector3();

for(let i=0;i<300;i++){

for(let other of objects){

if(object===other)continue;

let dir=
other.position.clone().sub(pos);

let dist=dir.length()+1;

let force=
G*other.userData.mass/
(dist*dist);

dir.normalize()
.multiplyScalar(force);

vel.add(dir);

}

pos.add(vel);

points.push(pos.clone());

}

const geo=
new THREE.BufferGeometry()
.setFromPoints(points);

const mat=
new THREE.LineBasicMaterial({
color:0x00ffff
});

object.orbitLine=
new THREE.Line(geo,mat);

scene.add(object.orbitLine);

}
