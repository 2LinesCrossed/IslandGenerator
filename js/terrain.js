import * as THREE from './lib/three.js';
import { Perlin } from './lib/perlin.js';
export function generateTerrain() {
  var geometry = new THREE.PlaneBufferGeometry(2000, 2000, 256, 256);
  var material = new THREE.MeshLambertMaterial({ color: 0x3c3951 });

  var terrain = new THREE.Mesh(geometry, material);
  terrain.rotation.x = -Math.PI / 2;
  terrain.geometry.attributes.position.needsUpdate = true;
  terrain.geometry.computeVertexNormals();

  //Change the peak value for different sizes.
  var perlin = new Perlin();
  var peak = 60;

  var vertices = terrain.geometry.attributes.position.array;
  for (var i = 0; i <= vertices.length; i += 3) {
    vertices[i + 2] = peak * Math.random();
  }
  terrain.geometry.attributes.position.needsUpdate = true;
  terrain.geometry.computeVertexNormals();
  return terrain;
}
