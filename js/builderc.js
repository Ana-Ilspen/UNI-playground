import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.minDistance = 10;
controls.maxDistance = 500;

// CD plane
const planeGeo = new THREE.PlaneGeometry(200,200,50,50);
const planeMat = new THREE.MeshStandardMaterial({ color:0x111111, side:THREE.DoubleSide, wireframe:true });
const cdPlane = new THREE.Mesh(planeGeo, planeMat);
cdPlane.rotation.x = -Math.PI/2;
scene.add(cdPlane);

// Light
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(50,100,50);
scene.add(light);

// Camera
camera.position.set(0,50,100);
camera.lookAt(0,0,0);

// Drag-and-drop
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedBody = null;
const bodies = [];

function addBody(name,type){
  const geo = new THREE.SphereGeometry(2,32,32);
  let color = 0xffffff;
  if(type==='Star') color=0xffdd55;
  if(type==='Black Hole') color=0x000000;
  if(type==='Antimatter') color=0xff00ff;
  const mat = new THREE.MeshStandardMaterial({color});
  const mesh = new THREE.Mesh(geo,mat);
  mesh.name=name;
  mesh.type=type;
  mesh.mass=Math.floor(Math.random()*1000);
  mesh.position.set((Math.random()-0.5)*50,2,(Math.random()-0.5)*50);
  scene.add(mesh);
  bodies.push(mesh);
  createPlacard(mesh);
}

// Bottom placards
function createPlacard(body){
  const panel = document.getElementById('infoPanel');
  const div = document.createElement('div');
  div.className='placard';
  div.innerHTML=`<strong>${body.name}</strong><br>Mass: ${body.mass}<br>Type: ${body.type}`;
  panel.appendChild(div);
}

// Mouse events
window.addEventListener('mousedown',e=>{
  mouse.x=(e.clientX/window.innerWidth)*2-1;
  mouse.y=-(e.clientY/window.innerHeight)*2+1;
  raycaster.setFromCamera(mouse,camera);
  const intersects = raycaster.intersectObjects(bodies);
  if(intersects.length>0) selectedBody=intersects[0].object;
});
window.addEventListener('mousemove',e=>{
  if(!selectedBody) return;
  mouse.x=(e.clientX/window.innerWidth)*2-1;
  mouse.y=-(e.clientY/window.innerHeight)*2+1;
  raycaster.setFromCamera(mouse,camera);
  const plane = new THREE.Plane(new THREE.Vector3(0,1,0),0);
  const point = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane,point);
  if(point) selectedBody.position.copy(point);
});
window.addEventListener('mouseup',e=>{selectedBody=null;});

// Search
document.getElementById('search').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase();
  Array.from(document.getElementById('infoPanel').children).forEach(p=>{
    if(!p.innerText.toLowerCase().includes(q)) p.style.display='none';
    else p.style.display='block';
  });
});

// Buttons
document.getElementById('addPlanet').addEventListener('click',()=>addBody('Planet','Planet'));
document.getElementById('addStar').addEventListener('click',()=>addBody('Star','Star'));
document.getElementById('addBlackHole').addEventListener('click',()=>addBody('Black Hole','Black Hole'));
document.getElementById('addAntimatter').addEventListener('click',()=>addBody('Antimatter','Antimatter'));

// Animate
function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene,camera);
}
animate();
