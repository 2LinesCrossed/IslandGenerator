import * as THREE from './lib/three.js';
import { buildGUI } from './gui.js';

import { OrbitControls } from './lib/orbitControls.js';
import { generateTerrain } from './terrain.js';
import { createWater, updateWater } from './water.js';
import { createParticleSystem } from './particles.js';

const initialWidth = window.innerWidth;
const initialHeight = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  initialWidth / initialHeight,
  0.1,
  300000
);
const renderer = new THREE.WebGLRenderer();

const controls = new OrbitControls(camera, renderer.domElement);
const waterObj = createWater();

let cameraTarget = { x: 0, y: 0, z: 0 };
let lastRenderTime = performance.now();
let deltaTime = 0.0; // The amount of time between frames (s)

let sunPos = [2000, 2223, 300];
let sunIntensity = 1;
let particleSpeed = 0.01;

let sun, directionalLight, terrain, particleSystem;

buildGUI((gui, folders) => {
  const params = {
    sunPosX: sunPos[0],
    sunPosY: sunPos[1],
    sunPosZ: sunPos[2],
    sunIntensity,
    particleSpeed
  };
  folders.lighting.add(params, 'sunPosX', -3000, 3000).onChange((val) => {
    sunPos[0] = val;
  });
  folders.lighting.add(params, 'sunPosY', -3000, 3000).onChange((val) => {
    sunPos[1] = val;
  });
  folders.lighting.add(params, 'sunPosZ', -3000, 3000).onChange((val) => {
    sunPos[2] = val;
  });
  folders.lighting.add(params, 'sunIntensity', 0, 5).onChange((val) => {
    sunIntensity = val;
  });
  folders.particles.add(params, 'particleSpeed', 0, 5).onChange((val) => {
    particleSpeed = val;
  });
});

export function initialiseScene() {
  // Set camera pos
  camera.position.y = 70;
  camera.position.z = 1000;
  camera.rotation.x = (-15 * Math.PI) / 180;

  // Renderer settings
  renderer.setClearColor(0xc3dde5, 100);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(initialWidth, initialHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Add to DOM
  document.body.appendChild(renderer.domElement);

  // Sky and sun (jiebin)
  const skyGeometry = new THREE.SphereGeometry(8000, 32, 32);
  const skyMaterial = new THREE.MeshMatcapMaterial({
    map: new THREE.TextureLoader().load('./textures/sky.png'),
    side: THREE.BackSide
  });
  const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(sky);

  // Hemisphere light (simulates scattered sunlight and prevents shadows from looking too harsh)
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.7);
  hemiLight.color.setHSL(0.6, 0.75, 0.5);
  hemiLight.position.set(0, 500, 0);
  scene.add(hemiLight);

  // Sun mesh
  const sphereGeometry = new THREE.SphereGeometry(200, 30, 30);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xf9d71c });
  sun = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sun);

  // Directional light
  directionalLight = new THREE.DirectionalLight(0xffffff, sunIntensity);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Terrain
  terrain = generateTerrain();
  scene.add(terrain);

  // Water
  scene.add(waterObj.plane);

  // Particle system
  particleSystem = createParticleSystem();
  scene.add(particleSystem);

  // Start the update loop
  renderer.setAnimationLoop(update);

  // Add event listeners
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  //get the new sizes
  const width = window.innerWidth;
  const height = window.innerHeight;
  //then update the renderer
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  //and update the aspect ratio of the camera
  camera.aspect = width / height;

  //update the projection matrix given the new values
  camera.updateProjectionMatrix();
  //and finally render the scene again
  renderer.render(scene, camera);
}

export function update() {
  // Update sun
  sun.position.set(...sunPos);
  directionalLight.position.set(...sunPos).normalize();
  directionalLight.intensity = sunIntensity;

  // Animate water
  updateWater(waterObj, lastRenderTime);

  // Animate particles
  particleSystem.rotation.y += particleSpeed * deltaTime;

  // Finally render
  render();

  // Calculate delta time based on time after previous render
  const renderTime = performance.now();
  deltaTime = (renderTime - lastRenderTime) / 1000.0;
  lastRenderTime = renderTime;
}

export function setTerrain(newTerrain) {
  scene.remove(terrain);
  terrain = newTerrain;
  scene.add(terrain);
}

export function render() {
  renderer.render(scene, camera);
  controls.update();
}
