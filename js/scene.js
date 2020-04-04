import * as THREE from './lib/three.js';
import { Perlin } from './lib/perlin.js';

var width = window.innerWidth;
var height = window.innerHeight;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
var renderer = new THREE.WebGLRenderer();
var cameraTarget = { x: 0, y: 0, z: 0 };

var lastRenderTime = performance.now();
var deltaTime = 0; // The amount of time between frames (ms)

//Scene Setup
export function initialiseScene() {
  camera.position.y = 70;
  camera.position.z = 1000;
  camera.rotation.x = (-15 * Math.PI) / 180;

  renderer.setClearColor(0xc3dde5, 100);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  var light = new THREE.DirectionalLight(0xffffff, 2);
  light.position
    .set(camera.position.x, camera.position.y + 500, camera.position.z + 500)
    .normalize();
  scene.add(light);

  //Terrain setup
  var geometry = new THREE.PlaneBufferGeometry(2000, 2000, 256, 256);
  var material = new THREE.MeshLambertMaterial({ color: 0x3c3951 });

  var terrain = new THREE.Mesh(geometry, material);
  terrain.rotation.x = -Math.PI / 2;
  terrain.geometry.attributes.position.needsUpdate = true;
  terrain.geometry.computeVertexNormals();

  scene.add(terrain);

  //Change the peak value for different sizes.
  var perlin = new Perlin();
  var peak = 60;

  var vertices = terrain.geometry.attributes.position.array;
  for (var i = 0; i <= vertices.length; i += 3) {
    vertices[i + 2] = peak * Math.random();
  }
  terrain.geometry.attributes.position.needsUpdate = true;
  terrain.geometry.computeVertexNormals();

  // Start the update loop
  renderer.setAnimationLoop(update);
}

function onWindowResize() {
  //get the new sizes
  var width = window.innerWidth;
  var height = window.innerHeight;
  //then update the renderer
  renderer.setSize(width, height);
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
}

window.addEventListener('resize', onWindowResize);
