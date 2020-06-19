import * as THREE from './lib/three.js';
import { Perlin } from './lib/perlin.js';
import { buildGUI } from './gui.js';
import * as scene from './scene.js';

var peak = 200;
var smoothing = 600;
export var myseed = Math.floor(1000 * Math.random());

buildGUI((gui, folders) => {
  var params = {
    hillpeak: peak,
    randomseed: myseed,
    smoothvalue: smoothing
  };

  folders.terrain.add(params, 'hillpeak', 0, 1000).onChange(function (val) {
    peak = val;
    updateTerrain();
  });
  folders.terrain.add(params, 'randomseed', 0, 1000).onChange(function (val) {
    //TODO: Make this one work
    myseed = val;
    updateTerrain();
  });
  folders.terrain.add(params, 'smoothvalue', 1, 1000).onChange(function (val) {
    smoothing = val;
    updateTerrain();
  });
});

export function generateTerrain() {
  var geometry = new THREE.PlaneBufferGeometry(4000, 4000, 256, 256);
  var material = new THREE.MeshPhysicalMaterial();

  material.onBeforeCompile = (shader) => {
    // Vertex Shader

    shader.vertexShader = shader.vertexShader.replace(
      `#include <common>`,
      `
        #include <common>
        varying float y;
        `
    );
    shader.vertexShader = shader.vertexShader.replace(
      `#include <begin_vertex>`,
      `
        #include <begin_vertex>
        y = ( position.z + 0.1 ) * 5.0;
        `
    );

    console.log(shader.vertexShader);

    // Fragment Shader

    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <common>`,
      `
        #include <common>
        varying float y;
        vec3 col;
        `
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      `gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
      `
        if (y <= 10.0) {
          col = vec3 ((250.0 / 255.0), (234.0 / 255.0), (164.0 / 255.0));
        }
        if (y > 60.0) {
          col = vec3 (0.235, 0.702, 0.443);
        }
        if (y > 10.0 && y < 60.0){
          col = vec3 (0.100, 0.702, 0.443);
        }
        outgoingLight *= col;
        gl_FragColor = vec4( outgoingLight, diffuseColor.a );
        `
    );

    console.log(shader.fragmentShader);
  };
  var terrain = new THREE.Mesh(geometry, material);
  terrain.rotation.x = -Math.PI / 2;
  terrain.geometry.attributes.position.needsUpdate = true;
  terrain.geometry.computeVertexNormals();

  //Change the peak value for different sizes.
  var perlin = new Perlin();

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

function updateTerrain() {
  const newTerrain = generateTerrain();
  scene.setTerrain(newTerrain);
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
