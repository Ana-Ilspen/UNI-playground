import * as THREE from "./lib/three.module.js"

export function terrain(radius)
{

const geo =
new THREE.SphereGeometry(radius,64,64)

const pos = geo.attributes.position

for(let i=0;i<pos.count;i++)
{

const v =
new THREE.Vector3()
.fromBufferAttribute(pos,i)

const h =
Math.sin(v.x*.3)+
Math.sin(v.y*.3)+
Math.sin(v.z*.3)

v.multiplyScalar(1+h*.02)

pos.setXYZ(i,v.x,v.y,v.z)

}

geo.computeVertexNormals()

return geo

}