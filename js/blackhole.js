import {scene} from "./main.js";

export function createBlackHole(radius){

let geo=new THREE.SphereGeometry(radius,64,64);

let mat=new THREE.MeshBasicMaterial({

color:0x000000

});

let mesh=new THREE.Mesh(geo,mat);

scene.add(mesh);

return mesh;

}
