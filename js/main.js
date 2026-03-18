import * as THREE from "../lib/three.module.js";
import { initBuilder, scaleRadius } from "./builder.js";
import { initUI, setInfo, setTerrainStudioTitle } from "./ui.js";
import { updateGravity } from "./gravity.js";
import { addAtmosphere } from "./atmosphere.js";
import { createBlackHoleMaterial } from "./blackhole.js";
import { bindTerrainEditing, setTerrainMode } from "./terrain.js";
import { showOrbit } from "./orbitPredict.js";
import { saveUniverse, loadUniverse } from "./saveLoad.js";
import { CELESTIAL_DATABASE } from "./database.js";
import { AU, BASE_TIME_STEP_S, DEFAULT_SUBSTEPS, DISTANCE_SCALE, G, SOLAR_MASS } from "./constants.js";

const infoMap = new Map(CELESTIAL_DATABASE.map((o) => [o.name, o]));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x03070d);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1e7);
camera.position.set(0, 8, 20);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("scene"), antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

scene.add(new THREE.AmbientLight(0xa8c7ff, 1.1));
const sunLight = new THREE.PointLight(0xfff0bf, 3.5, 0, 2);
scene.add(sunLight);

const grid = new THREE.GridHelper(500, 100, 0x224060, 0x1a253a);
grid.position.y = -0.02;
scene.add(grid);

addStarfield();

const objects = [];
const fluidParticles = [];
const lightRays = [];
const labelsLayer = document.getElementById("labelsLayer");
const labels = new Map();

let fluidEnabled = false;
let terrainEnabled = false;
let studioTarget = null;

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
  onToggleTerrain: (forceOn = null) => {
    terrainEnabled = forceOn === null ? !terrainEnabled : forceOn;
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
  },
  onZoomIn: () => zoom(0.82),
  onZoomOut: () => zoom(1.2),
  onOpenTerrainStudio: () => openTerrainStudio(),
  onCloseTerrainStudio: () => closeTerrainStudio()
});

renderer.domElement.addEventListener("click", (event) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(objects);
  if (hits.length) selectObject(hits[0].object);
});

window.addEventListener("wheel", (e) => {
  zoom(e.deltaY > 0 ? 1.08 : 0.92);
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
  updateLabels();

  if (studioTarget) {
    const follow = studioTarget.position.clone().add(new THREE.Vector3(0, scaleRadius(studioTarget.userData.radiusMeters) * 2.2, scaleRadius(studioTarget.userData.radiusMeters) * 4));
    camera.position.lerp(follow, 0.08);
    camera.lookAt(studioTarget.position);
  } else {
    camera.lookAt(0, 0, 0);
  }

  renderer.render(scene, camera);
}
animate();

function createBody(data) {
  const radiusScaled = scaleRadius(data.radius);
  const geo = new THREE.SphereGeometry(radiusScaled, 64, 64);

  const mat = data.type === "blackhole"
    ? createBlackHoleMaterial()
    : new THREE.MeshStandardMaterial({
      color: data.color || 0x5d7ca6,
      roughness: 0.6,
      metalness: 0.1,
      emissive: ["star", "neutron-star", "magnetar", "quasar"].includes(data.type) ? data.color || 0xffffff : 0x000000,
      emissiveIntensity: ["star", "neutron-star", "magnetar", "quasar"].includes(data.type) ? 0.75 : 0
    });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData = {
    name: data.name,
    type: data.type || "planet",
    mass: data.mass,
    radiusMeters: data.radius,
    fixed: Boolean(data.fixed),
    facts: data.facts || null,
    state: { positionM: new THREE.Vector3(), velocityMps: new THREE.Vector3() }
  };

  if (["planet", "exoplanet", "dwarf-planet"].includes(mesh.userData.type)) addAtmosphere(mesh);

  objects.push(mesh);
  scene.add(mesh);
  createLabel(mesh);
  return mesh;
}

function selectObject(mesh) {
  studioTarget = mesh;
  const speed = mesh.userData.state.velocityMps.length();
  const gravity = (G * mesh.userData.mass) / Math.max(mesh.userData.radiusMeters ** 2, 1);
  const known = infoMap.get(mesh.userData.name);
  const facts = known?.facts || defaultFact(mesh);

  setInfo(
    `${mesh.userData.name} (${mesh.userData.type})\nMass: ${mesh.userData.mass.toExponential(3)} kg\nRadius: ${mesh.userData.radiusMeters.toExponential(3)} m\nSurface g ≈ ${gravity.toFixed(2)} m/s²\nSpeed: ${speed.toFixed(1)} m/s\nFact: ${facts}`
  );

  setTerrainStudioTitle(`Terrain Studio target: ${mesh.userData.name}`);
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

function zoom(factor) {
  camera.position.multiplyScalar(factor);
}

function openTerrainStudio() {
  if (!studioTarget) {
    setInfo("Select a planet or body first, then open Terrain Studio.");
    return;
  }
  terrainEnabled = true;
  setTerrainMode(true);
}

function closeTerrainStudio() {
  terrainEnabled = false;
  setTerrainMode(false);
  studioTarget = null;
}

function createLabel(mesh) {
  const label = document.createElement("div");
  label.className = "miniLabel";
  label.textContent = mesh.userData.name;
  labelsLayer.appendChild(label);
  labels.set(mesh, label);
}

function updateLabels() {
  for (const [mesh, label] of labels.entries()) {
    const screenPos = mesh.position.clone().project(camera);
    const visible = screenPos.z < 1;
    label.style.display = visible ? "block" : "none";
    if (!visible) continue;
    label.style.left = `${(screenPos.x * 0.5 + 0.5) * window.innerWidth}px`;
    label.style.top = `${(-screenPos.y * 0.5 + 0.5) * window.innerHeight}px`;
  }
}

function addStarfield() {
  const count = 2800;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 2500 + Math.random() * 3000;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.8, sizeAttenuation: false });
  scene.add(new THREE.Points(geo, mat));
}

function defaultFact(mesh) {
  if (mesh.userData.type.includes("star")) return "Stars generate energy through nuclear fusion in their cores.";
  if (mesh.userData.type.includes("blackhole")) return "Black holes are regions where escape velocity exceeds the speed of light.";
  if (mesh.userData.type.includes("planet")) return "Planets can have diverse atmospheres, climates, and geological histories.";
  return "This celestial body can be simulated with gravity and terrain sculpting interactions here.";
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
      const label = labels.get(objects[i]);
      if (label) label.remove();
      labels.delete(objects[i]);
      scene.remove(objects[i]);
      objects.splice(i, 1);
    }
  }
}
