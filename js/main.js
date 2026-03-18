import * as THREE from "../lib/three.module.js";
import { initBuilder, scaleRadius } from "./builder.js";
import { initUI, setInfo } from "./ui.js";
import { updateGravity } from "./gravity.js";
import { addAtmosphere } from "./atmosphere.js";
import { createBlackHoleMaterial } from "./blackhole.js";
import { bindTerrainEditing, setTerrainMode } from "./terrain.js";
import { showOrbit } from "./orbitPredict.js";
import { saveUniverse, loadUniverse } from "./saveLoad.js";
import { AU, BASE_TIME_STEP_S, DEFAULT_SUBSTEPS, DISTANCE_SCALE, G, SOLAR_MASS } from "./constants.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x03070d);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1e7);
camera.position.set(0, 12, 30);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("scene"), antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

scene.add(new THREE.HemisphereLight(0xa8c7ff, 0x0f101a, 1.1));
const sunLight = new THREE.PointLight(0xfff0bf, 2.2, 0, 2);
scene.add(sunLight);

const grid = new THREE.GridHelper(500, 100, 0x224060, 0x1a253a);
grid.position.y = -0.02;
scene.add(grid);

const objects = [];
const fluidParticles = [];
const lightRays = [];
let fluidEnabled = false;
let terrainEnabled = false;

const sun = createBody({ name: "Sun", type: "star", mass: SOLAR_MASS, radius: 6.9634e8, color: 0xffcc55, fixed: true });
setPhysicalPosition(sun, new THREE.Vector3(0, 0, 0));

createPlanetFromInputs({ name: "Earth", mass: 5.972e24, radius: 6.371e6, distance: AU, surfaceGravity: 9.81 });

initBuilder({
  scene,
  camera,
  renderer,
  createBody,
  onSelect: selectObject,
  setDroppedPosition: (mesh, scenePos) => {
    setPhysicalPosition(mesh, sceneToPhysical(scenePos));
    mesh.userData.state.velocityMps.copy(estimateCircularVelocity(sceneToPhysical(scenePos)));
  }
});
bindTerrainEditing({ renderer, camera, objects });

initUI({
  onModeChange: () => {},
  onCreatePlanet: createPlanetFromInputs,
  onToggleTerrain: () => {
    terrainEnabled = !terrainEnabled;
    setTerrainMode(terrainEnabled);
    setInfo(terrainEnabled ? "Terrain sculpt ON" : "Terrain sculpt OFF");
  },
  onSave: () => saveUniverse(objects.filter((o) => o !== sun)),
  onLoad: () => {
    clearNonStarObjects();
    const loaded = loadUniverse(createBody);
    setInfo(`Loaded ${loaded.length} objects`);
  },
  onToggleFluid: () => {
    fluidEnabled = !fluidEnabled;
    setInfo(fluidEnabled ? "Fluid particles ON" : "Fluid particles OFF");
    if (!fluidEnabled) {
      fluidParticles.forEach((p) => scene.remove(p));
      fluidParticles.length = 0;
    }
  },
  onSpawnLight: () => {
    const geom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-40, 3, -40), new THREE.Vector3(40, 3, 40)]);
    const line = new THREE.Line(geom, new THREE.LineBasicMaterial({ color: 0xfff4a3 }));
    line.userData.velocity = new THREE.Vector3(0.22, 0, 0.2);
    lightRays.push(line);
    scene.add(line);
  }
});

renderer.domElement.addEventListener("click", (event) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(objects);
  if (hits.length) selectObject(hits[0].object);
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);

  for (let i = 0; i < DEFAULT_SUBSTEPS; i++) {
    updateGravity(objects, BASE_TIME_STEP_S / DEFAULT_SUBSTEPS);
  }

  for (const body of objects) {
    body.position.copy(physicalToScene(body.userData.state.positionM));
  }

  if (fluidEnabled) updateFluid();
  updateLightRays();

  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}
animate();

function createBody(data) {
  const geo = new THREE.SphereGeometry(scaleRadius(data.radius), 48, 48);
  const mat = data.type === "blackhole" ? createBlackHoleMaterial() : new THREE.MeshStandardMaterial({ color: data.color || 0x5d7ca6, roughness: 0.8, metalness: 0.1 });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData = {
    name: data.name,
    type: data.type || "planet",
    mass: data.mass,
    radiusMeters: data.radius,
    fixed: Boolean(data.fixed),
    state: { positionM: new THREE.Vector3(), velocityMps: new THREE.Vector3() }
  };

  if (mesh.userData.type === "planet") addAtmosphere(mesh);

  objects.push(mesh);
  scene.add(mesh);
  return mesh;
}

function selectObject(mesh) {
  const speed = mesh.userData.state.velocityMps.length();
  setInfo(`${mesh.userData.name} | Mass: ${mesh.userData.mass.toExponential(3)} kg | Speed: ${speed.toFixed(1)} m/s`);
  showOrbit(scene, mesh, objects, { dt: BASE_TIME_STEP_S, steps: 300, physicalToScene });
}

function createPlanetFromInputs(payload) {
  const planet = createBody({ name: payload.name || "Custom Planet", type: "planet", mass: payload.mass, radius: payload.radius, color: 0x4d8ccb });

  const distance = Math.max(payload.distance, payload.radius * 2);
  const posM = new THREE.Vector3(distance, 0, 0);
  const velMps = estimateCircularVelocity(posM);

  setPhysicalPosition(planet, posM);
  planet.userData.state.velocityMps.copy(velMps);
  selectObject(planet);

  if (Number.isFinite(payload.surfaceGravity)) {
    const estimated = (G * payload.mass) / (payload.radius * payload.radius);
    setInfo(`${planet.userData.name} created. target g=${payload.surfaceGravity.toFixed(2)} m/s², estimated g=${estimated.toFixed(2)} m/s²`);
  }
}

function estimateCircularVelocity(positionM) {
  const r = Math.max(positionM.length(), 1);
  const speed = Math.sqrt((G * sun.userData.mass) / r);
  return new THREE.Vector3(0, 0, speed);
}

function setPhysicalPosition(mesh, posM) {
  mesh.userData.state.positionM.copy(posM);
  mesh.position.copy(physicalToScene(posM));
}

function physicalToScene(v) {
  return v.clone().divideScalar(DISTANCE_SCALE);
}

function sceneToPhysical(v) {
  return v.clone().multiplyScalar(DISTANCE_SCALE);
}

function updateFluid() {
  if (fluidParticles.length < 250) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshBasicMaterial({ color: 0x77ddff }));
    p.position.set((Math.random() - 0.5) * 30, Math.random() * 5 + 1, (Math.random() - 0.5) * 30);
    p.userData.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.08, 0, (Math.random() - 0.5) * 0.08);
    fluidParticles.push(p);
    scene.add(p);
  }
  for (const p of fluidParticles) {
    p.userData.velocity.y -= 0.0025;
    p.position.add(p.userData.velocity);
    if (p.position.y < 0) {
      p.position.y = 0;
      p.userData.velocity.y *= -0.6;
    }
  }
}

function updateLightRays() {
  for (const line of lightRays) {
    line.position.add(line.userData.velocity);
    if (line.position.length() > 100) line.position.set(0, 0, 0);
  }
}

function clearNonStarObjects() {
  for (let i = objects.length - 1; i >= 0; i--) {
    if (objects[i].userData.type !== "star") {
      scene.remove(objects[i]);
      objects.splice(i, 1);
    }
  }
}
