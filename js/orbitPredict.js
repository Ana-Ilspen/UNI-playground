import * as THREE from "../lib/three.module.js";
import { G } from "./constants.js";

export function showOrbit(scene, object, objects, { dt = 1200, steps = 250, physicalToScene }) {
  if (!object?.userData?.mass || !object.userData.state) return;

  if (object.userData.orbitLine) scene.remove(object.userData.orbitLine);

  const simulated = objects.map((o) => ({
    mass: o.userData.mass,
    fixed: o.userData.fixed,
    positionM: o.userData.state.positionM.clone(),
    velocityMps: o.userData.state.velocityMps.clone(),
    source: o
  }));

  const target = simulated.find((s) => s.source === object);
  if (!target) return;

  const points = [];

  for (let step = 0; step < steps; step++) {
    const accel = simulated.map(() => new THREE.Vector3());

    for (let i = 0; i < simulated.length; i++) {
      for (let j = i + 1; j < simulated.length; j++) {
        const a = simulated[i];
        const b = simulated[j];
        const dir = new THREE.Vector3().subVectors(b.positionM, a.positionM);
        const distSq = Math.max(dir.lengthSq(), 1e6);
        const dist = Math.sqrt(distSq);
        const unit = dir.divideScalar(dist);

        if (!a.fixed) accel[i].addScaledVector(unit, (G * b.mass) / distSq);
        if (!b.fixed) accel[j].addScaledVector(unit, -(G * a.mass) / distSq);
      }
    }

    for (let i = 0; i < simulated.length; i++) {
      if (simulated[i].fixed) continue;
      simulated[i].velocityMps.addScaledVector(accel[i], dt);
      simulated[i].positionM.addScaledVector(simulated[i].velocityMps, dt);
    }

    points.push(physicalToScene(target.positionM));
  }

  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: 0x5fd7ff })
  );

  object.userData.orbitLine = line;
  scene.add(line);
}
