import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function applyTerrain(geometry, rough){
  if(rough<=0) return;
  const posAttr = geometry.attributes.position;
  for(let i=0;i<posAttr.count;i++){
    const v = new THREE.Vector3().fromBufferAttribute(posAttr,i);
    const h=(Math.sin(v.x*rough)+Math.sin(v.y*rough)+Math.sin(v.z*rough))*0.3;
    v.normalize().multiplyScalar(v.length()+h*rough);
    posAttr.setXYZ(i,v.x,v.y,v.z);
  }
  geometry.computeVertexNormals();
}
