import * as THREE from "../lib/three.module.js";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const BRUSH_RADIUS = 0.22;
const BRUSH_STRENGTH = 0.04;

let enabled = false;
let active = false;

export function setTerrainMode(flag) {
  enabled = flag;
}

export function bindTerrainEditing({ renderer, camera, objects }) {
  const dom = renderer.domElement;

  dom.addEventListener("pointerdown", () => {
    if (enabled) active = true;
  });

  window.addEventListener("pointerup", () => {
    active = false;
  });

  dom.addEventListener("pointermove", (event) => {
    if (!enabled || !active) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(objects);
    if (!hits.length) return;

    const hit = hits[0];
    sculpt(hit.object, hit.point, event.shiftKey ? -1 : 1);
  });
}

function sculpt(mesh, worldPoint, direction) {
  const pos = mesh.geometry.attributes.position;
  if (!pos) return;

  const localPoint = mesh.worldToLocal(worldPoint.clone());

  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
    const dist = v.distanceTo(localPoint);
    if (dist > BRUSH_RADIUS) continue;

    const influence = 1 - dist / BRUSH_RADIUS;
    const normal = v.clone().normalize().multiplyScalar(BRUSH_STRENGTH * influence * direction);
    v.add(normal);
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  pos.needsUpdate = true;
  mesh.geometry.computeVertexNormals();
}
