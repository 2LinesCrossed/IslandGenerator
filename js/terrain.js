import * as THREE from './lib/three.js';
import { Perlin } from './lib/perlin.js';
import { buildGUI } from './gui.js';
import * as scene from './scene.js';

var peak = 350;
var smoothing = 70;
export var myseed = Math.floor(1000 * Math.random());
var freq = 5;

buildGUI((gui, folders) => {
  var params = {
    hillpeak: peak,
    randomseed: myseed,
    smoothvalue: smoothing,
    frequency: freq
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
  folders.terrain.add(params, 'smoothvalue', 1, 100).onChange(function (val) {
    smoothing = val;
    updateTerrain();
  });
  folders.terrain.add(params, 'frequency', 1, 10).onChange(function (val) {
    freq = val;
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
        if (y <= 160.0) {
          col = vec3 ((235.0 / 255.0), (233.0 / 255.0), (90.0 / 255.0));
        }
        if (y > 160.0 && y < 330.0){
          col = vec3 ((100.0 / 255.0), (120.0 / 255.0), (60.0 / 255.0));
        }
        if (y >= 330.0 && y < 600.0) {
          col = vec3 ((100.0 / 255.0), (160.0 / 255.0), (60.0 / 255.0));
        }
        if (y >= 600.0 && y < 880.0) {
          col = vec3 ((180.0 / 255.0), (180.0 / 255.0), (180.0 / 255.0));
        }
        if (y >= 880.0) {
          col = vec3 ((230.0 / 255.0), (230.0 / 255.0), (180.0 / 255.0));
        }
        outgoingLight *= col;
        gl_FragColor = vec4( outgoingLight, diffuseColor.a );
        `
    );
  };

  var terrain = new THREE.Mesh(geometry, material);
  terrain.rotation.x = -Math.PI / 2;
  terrain.geometry.attributes.position.needsUpdate = true;
  terrain.geometry.computeVertexNormals();

  //Change the peak value for different sizes.
  var perlin = new Perlin();
  var vertices = terrain.geometry.attributes.position.array;

  for (var i = 0; i <= vertices.length; i += 3) {
    let x = vertices[i];
    let y = vertices[i + 1];
    let smooth = smoothing * 40;
    let nx = x / smooth - 0.5,
      ny = y / smooth - 0.5;
    let vert = 0;
    let vertdiv1 = 1;
    let vertdiv2 = 1;
    let vs = [];
    let itt = 0;
    while (itt < freq) {
      vert += vertdiv1 * perlin.noise(nx * vertdiv2, ny * vertdiv2);
      let v1 = vertdiv1 / 2;
      let v2 = vertdiv2 * 2;
      vertdiv1 = v1;
      vertdiv2 = v2;
      itt += 1;
    }
    vertices[i + 2] = peak * vert;
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
