import {scene,camera,renderer,objects} from "./main.js";

let sculptMode=false;
let selected=null;

const raycaster=new THREE.Raycaster();
const mouse=new THREE.Vector2();

const BRUSH_RADIUS=5000;
const BRUSH_STRENGTH=800;

export function toggleTerrain(){

sculptMode=!sculptMode;

alert(
sculptMode?
"SCULPT MODE ON\nClick planet to sculpt":
"SCULPT MODE OFF"
);

}

window.toggleTerrain=toggleTerrain;


window.addEventListener("mousedown",(e)=>{

if(!sculptMode)return;

mouse.x=(e.clientX/window.innerWidth)*2-1;
mouse.y=-(e.clientY/window.innerHeight)*2+1;

raycaster.setFromCamera(mouse,camera);

const intersects=
raycaster.intersectObjects(objects);

if(intersects.length===0)return;

selected=intersects[0].object;

sculpt(selected,intersects[0].point,e);

});


function sculpt(mesh,point,event){

if(!mesh.geometry.attributes.position)return;

const positions=
mesh.geometry.attributes.position;

for(let i=0;i<positions.count;i++){

const vx=positions.getX(i);
const vy=positions.getY(i);
const vz=positions.getZ(i);

const vertex=
new THREE.Vector3(vx,vy,vz)
.applyMatrix4(mesh.matrixWorld);

const dist=
vertex.distanceTo(point);

if(dist<BRUSH_RADIUS){

let influence=
(1-dist/BRUSH_RADIUS);

let normal=
vertex.clone()
.sub(mesh.position)
.normalize();

if(event.shiftKey){

// lower terrain
normal.multiplyScalar(
-BRUSH_STRENGTH*influence
);

}else if(event.altKey){

// smooth
normal.multiplyScalar(
0
);

}else{

// raise terrain
normal.multiplyScalar(
BRUSH_STRENGTH*influence
);

}

positions.setXYZ(
i,
vx+normal.x,
vy+normal.y,
vz+normal.z
);

}

}

positions.needsUpdate=true;

mesh.geometry.computeVertexNormals();

}
