import * as THREE from "../lib/three.module.js";
import { G } from "./constants.js";

function computeAccelerations(objects) {
  const accelerations = objects.map(() => new THREE.Vector3());

  for (let i = 0; i < objects.length; i++) {
    for (let j = i + 1; j < objects.length; j++) {
      const a = objects[i];
      const b = objects[j];

      const pa = a.userData.state.positionM;
      const pb = b.userData.state.positionM;
      const dir = new THREE.Vector3().subVectors(pb, pa);
      const distSq = Math.max(dir.lengthSq(), 1e6);
      const dist = Math.sqrt(distSq);
      const unit = dir.divideScalar(dist);

      const accelOnA = (G * b.userData.mass) / distSq;
      const accelOnB = (G * a.userData.mass) / distSq;

      if (!a.userData.fixed) accelerations[i].addScaledVector(unit, accelOnA);
      if (!b.userData.fixed) accelerations[j].addScaledVector(unit, -accelOnB);
    }
  }

  return accelerations;
}

// velocity Verlet integration in SI units
export function updateGravity(objects, dtSeconds) {
  for (const body of objects) {
    if (!body.userData.state) {
      body.userData.state = {
        positionM: new THREE.Vector3(),
        velocityMps: new THREE.Vector3()
      };
    }
  }

  const accel0 = computeAccelerations(objects);

  for (let i = 0; i < objects.length; i++) {
    const body = objects[i];
    if (body.userData.fixed) continue;

    const state = body.userData.state;
    state.positionM.addScaledVector(state.velocityMps, dtSeconds);
    state.positionM.addScaledVector(accel0[i], 0.5 * dtSeconds * dtSeconds);
  }

  const accel1 = computeAccelerations(objects);

  for (let i = 0; i < objects.length; i++) {
    const body = objects[i];
    if (body.userData.fixed) continue;

    const state = body.userData.state;
    state.velocityMps.addScaledVector(accel0[i].add(accel1[i]), 0.5 * dtSeconds);
  }
}
