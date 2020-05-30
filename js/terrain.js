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
  var peak = 200;
  var smoothing = 600;
  var myseed = Math.random(1000);

  var vertices = terrain.geometry.attributes.position.array;
  for (var i = 0; i <= vertices.length; i += 3) {
    vertices[i + 2] =
      peak * perlin.noise(vertices[i] / smoothing, vertices[i + 1] / smoothing);
    peak *
      0.5 *
      perlin.noise(
        (vertices[i] * 10) / smoothing,
        (vertices[i + 1] * 10) / smoothing
      );
    peak *
      2 *
      perlin.noise(
        (vertices[i] * 5) / (smoothing / 100),
        (vertices[i + 3] * 5) / (smoothing / 100)
      );
  }
  terrain.geometry.attributes.position.needsUpdate = true;
  terrain.geometry.computeVertexNormals();
  return terrain;
}

/*void function getYPosition(float_x, float_z){
  var y = perlin.noise((float_x + 100) / 15, (float_z+100) / 15, mySeed);
  y *= 10;
  y += dist(float_x, float_z, 0, 0) / 2;
  return y;
}
*/
//Reverse engineer that one https://www.openprocessing.org/sketch/816746 for this section!
/* float getYHeight (float _x, float _z) {
	float y = noise((_x+100) / 15, mySeed, (_z+100) / 15);
	y *= 10;
	y += dist(_x, _z, 0, 0) / 2;
	return y;
} 
*/
