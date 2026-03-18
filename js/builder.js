import * as THREE from "../lib/three.module.js";
import { CELESTIAL_DATABASE } from "./database.js";
import { RADIUS_SCALE } from "./constants.js";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function initBuilder({ scene, camera, renderer, createBody, onSelect, setDroppedPosition }) {
  const objectList = document.getElementById("objectList");
  const objectCount = document.getElementById("objectCount");
  const filtersWrap = document.getElementById("quickFilters");
  const search = document.getElementById("search");

  let dragPreset = null;
  let ghost = null;
  let activeFilter = "all";

  const availableTypes = ["all", ...new Set(CELESTIAL_DATABASE.map((obj) => obj.type))];
  const filterButtons = availableTypes.map((type) => {
    const button = document.createElement("button");
    button.className = `small ${type === "all" ? "active" : ""}`;
    button.dataset.filter = type;
    button.textContent = prettifyType(type);
    button.addEventListener("click", () => {
      activeFilter = type;
      filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
      renderList(search.value);
    });
    filtersWrap.appendChild(button);
    return button;
  });

  function renderList(filterText = "") {
    objectList.innerHTML = "";
    const query = filterText.trim().toLowerCase();

    const filtered = CELESTIAL_DATABASE
      .filter((item) => activeFilter === "all" || item.type === activeFilter)
      .filter((item) => item.name.toLowerCase().includes(query));

    objectCount.textContent = String(filtered.length);

    filtered.forEach((item) => {
      const div = document.createElement("div");
      div.className = "objectItem";
      div.innerHTML = `
        <div class="objectTitle">${item.name}</div>
        <div class="objectMeta">
          <span class="objectType">${prettifyType(item.type)}</span>
          <span>Mass ${item.mass.toExponential(2)} kg</span>
        </div>
      `;

      div.addEventListener("pointerdown", () => {
        dragPreset = item;
        ghost = createGhost(item);
        scene.add(ghost);
      });

      objectList.appendChild(div);
    });
  }

  search.addEventListener("input", () => renderList(search.value));
  renderList();

  renderer.domElement.addEventListener("pointermove", (event) => {
    if (!ghost) return;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const point = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, point);
    ghost.position.copy(point);
  });

  window.addEventListener("pointerup", () => {
    if (!ghost || !dragPreset) return;
    const mesh = createBody(dragPreset);
    setDroppedPosition(mesh, ghost.position.clone());
    onSelect(mesh);
    scene.remove(ghost);
    ghost = null;
    dragPreset = null;
  });
}

function createGhost(data) {
  const geo = new THREE.SphereGeometry(scaleRadius(data.radius), 24, 24);
  const mat = new THREE.MeshBasicMaterial({ color: data.color, transparent: true, opacity: 0.45 });
  return new THREE.Mesh(geo, mat);
}

function prettifyType(type) {
  if (type === "all") return "All";
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function scaleRadius(radiusMeters) {
  return Math.max(0.2, radiusMeters / RADIUS_SCALE);
}
