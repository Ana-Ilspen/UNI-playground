import {scene,objects,camera} from "./main.js";
import {CELESTIAL_DATABASE} from "./database.js";

let dragged=null;
let ghost=null;

const raycaster=new THREE.Raycaster();
const mouse=new THREE.Vector2();

function createMesh(data){

let geo=new THREE.SphereGeometry(data.radius,32,32);

let mat=new THREE.MeshStandardMaterial({

color:data.color

});

let mesh=new THREE.Mesh(geo,mat);

mesh.userData=data;

scene.add(mesh);

objects.push(mesh);

return mesh;

}

function createGhost(data){

let geo=new THREE.SphereGeometry(data.radius,16,16);

let mat=new THREE.MeshBasicMaterial({

color:data.color,
transparent:true,
opacity:0.5

});

ghost=new THREE.Mesh(geo,mat);

scene.add(ghost);

}

window.addEventListener("mousemove",(e)=>{

if(!ghost)return;

mouse.x=(e.clientX/window.innerWidth)*2-1;
mouse.y=-(e.clientY/window.innerHeight)*2+1;

raycaster.setFromCamera(mouse,camera);

let plane=new THREE.Plane(new THREE.Vector3(0,1,0),0);

let pos=new THREE.Vector3();

raycaster.ray.intersectPlane(plane,pos);

ghost.position.copy(pos);

});

window.addEventListener("mouseup",()=>{

if(!ghost)return;

let mesh=createMesh(dragged);

mesh.position.copy(ghost.position);

scene.remove(ghost);

ghost=null;

});

export function populateList(){

let list=document.getElementById("objectList");

CELESTIAL_DATABASE.forEach(obj=>{

let div=document.createElement("div");

div.className="objectItem";

div.innerText=obj.name;

div.onmousedown=()=>{

dragged=obj;

createGhost(obj);

};

list.appendChild(div);

});

}

populateList();
