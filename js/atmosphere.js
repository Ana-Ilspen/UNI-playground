export function addAtmosphere(mesh){

let geo=new THREE.SphereGeometry(
mesh.geometry.parameters.radius*1.1,
32,
32
);

let mat=new THREE.MeshBasicMaterial({

color:0x66aaff,
transparent:true,
opacity:0.2

});

let atm=new THREE.Mesh(geo,mat);

mesh.add(atm);

}
