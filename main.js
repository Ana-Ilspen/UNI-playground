import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

/* ---------- BASIC SETUP ---------- */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000000000
);

camera.position.set(0, 50, 200);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


/* ---------- LIGHT ---------- */

const light = new THREE.PointLight(0xffffff, 2);

light.position.set(0, 0, 0);

scene.add(light);


/* ---------- STAR ---------- */

const starGeo = new THREE.SphereGeometry(20, 64, 64);

const starMat = new THREE.MeshStandardMaterial({
    color: 0xffffaa,
    emissive: 0xffffaa,
    emissiveIntensity: 2
});

const star = new THREE.Mesh(starGeo, starMat);

scene.add(star);


/* ---------- PLANET ---------- */

const planetGeo = new THREE.SphereGeometry(5, 64, 64);

const planetMat = new THREE.MeshStandardMaterial({
    color: 0x3399ff
});

const planet = new THREE.Mesh(planetGeo, planetMat);

planet.position.x = 100;

scene.add(planet);


/* ---------- ORBIT VARIABLES ---------- */

let angle = 0;


/* ---------- LOOP ---------- */

function loop() {

    requestAnimationFrame(loop);

    angle += 0.01;

    planet.position.x = Math.cos(angle) * 100;
    planet.position.z = Math.sin(angle) * 100;

    renderer.render(scene, camera);
}

loop();


/* ---------- RESIZE ---------- */

window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

});
