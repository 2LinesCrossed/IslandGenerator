import * as THREE from './lib/three.js';
import { OrbitControls } from './lib/orbitControls.js';
import { generateTerrain } from './terrain.js';

var width = window.innerWidth;
var height = window.innerHeight;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 300000);
var renderer = new THREE.WebGLRenderer();

var cameraTarget = { x: 0, y: 0, z: 0 };
var controls = new OrbitControls(camera, renderer.domElement);
var lastRenderTime = performance.now();
var deltaTime = 0; // The amount of time between frames (ms)

var light;

//Scene Setup
export function initialiseScene() {
  camera.position.y = 70;
  camera.position.z = 1000;
  camera.rotation.x = (-15 * Math.PI) / 180;

  renderer.setClearColor(0xc3dde5, 100);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  document.body.appendChild(renderer.domElement);

  // Sky and sun (jiebin)
  var skyGeometry = new THREE.SphereGeometry(3000, 32, 32);
  var skyMaterial = new THREE.MeshMatcapMaterial({
    map: new THREE.TextureLoader().load('./textures/sky.png'),
    side: THREE.BackSide
  });
  var sky = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(sky);
  //sun
  var sphereGeometry = new THREE.SphereGeometry(200, 30, 30);
  var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xf9d71c });
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.x = 2000;
  sphere.position.y = 1223; //maximum 380
  sphere.position.z = 300;
  scene.add(sphere);

  light = new THREE.DirectionalLight(0xffffff, 2);
  light.position
    .set(sphere.position.x, sphere.position.y, sphere.position.z)
    .normalize();
  scene.add(light);

  var terrain = generateTerrain();
  scene.add(terrain);

  // Start the update loop
  renderer.setAnimationLoop(update);

  // Add event listeners
  window.addEventListener('resize', onWindowResize);
}
//////////////
// CONTROLS //
//////////////

// move mouse and: left   click to rotate,
//                 middle click to zoom,
//                 right  click to pan
// add the new control and link to the current camera to transform its position

var controls = new OrbitControls(camera, renderer.domElement);

function onWindowResize() {
  //get the new sizes
  var width = window.innerWidth;
  var height = window.innerHeight;
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

function update() {
  render();

  // Calculate delta time based on time after previous render
  var renderTime = performance.now();
  deltaTime = renderTime - lastRenderTime;
  lastRenderTime = renderTime;
}

function render() {
  renderer.render(scene, camera);
  controls.update();
}
