import { createPlanet } from './planet.js';
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { bodies } from './constants.js';

export function createPlanetUI(){
  const r=parseFloat(document.getElementById('radius').value);
  const m=parseFloat(document.getElementById('mass').value);
  const d=parseFloat(document.getElementById('distance').value);
  const s=parseFloat(document.getElementById('speed').value);
  const a=parseFloat(document.getElementById('atm').value);
  const t=parseFloat(document.getElementById('terrain').value);
  createPlanet(r,m,new THREE.Vector3(d,0,0),new THREE.Vector3(0,0,s),a,t);
}

export function saveUniverse(){
  const data={bodies:bodies.map(b=>({
    pos:b.mesh.position.toArray(),
    vel:b.velocity.toArray(),
    mass:b.mass,
    type:b.type
  }))};
  const blob=new Blob([JSON.stringify(data)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download="universe.json"; a.click();
}

export function loadUniverse(){
  const input=document.createElement('input'); input.type='file';
  input.onchange=e=>{
    const file=input.files[0]; const reader=new FileReader();
    reader.onload=function(){
      const json=JSON.parse(reader.result);
      bodies.forEach(b=>b.mesh.parent.remove(b.mesh));
      bodies.length=0;
      for(const b of json.bodies){
        const pos=new THREE.Vector3().fromArray(b.pos);
        const vel=new THREE.Vector3().fromArray(b.vel);
        if(b.type==="planet") createPlanet(1,b.mass,pos,vel,1,1);
        else if(b.type==="blackhole") import('./blackhole.js').then(m=>m.createBlackHole(pos));
      }
    };
    reader.readAsText(file);
  };
  input.click();
}
