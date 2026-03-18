export function saveUniverse(objects) {
  const payload = objects.map((o) => ({
    userData: {
      name: o.userData.name,
      type: o.userData.type,
      mass: o.userData.mass,
      radius: o.userData.radiusMeters,
      fixed: Boolean(o.userData.fixed)
    },
    state: {
      positionM: o.userData.state.positionM.toArray(),
      velocityMps: o.userData.state.velocityMps.toArray()
    }
  }));

  localStorage.setItem("universe-playground-save", JSON.stringify(payload));
}

export function loadUniverse(createBodyFromData) {
  const raw = localStorage.getItem("universe-playground-save");
  if (!raw) return [];
  const parsed = JSON.parse(raw);

  return parsed.map((entry) => {
    const mesh = createBodyFromData(entry.userData);
    mesh.userData.state.positionM.fromArray(entry.state.positionM || [0, 0, 0]);
    mesh.userData.state.velocityMps.fromArray(entry.state.velocityMps || [0, 0, 0]);
    mesh.position.set(0, 0, 0); // will be synced from physical state in animation loop
    return mesh;
  });
}
