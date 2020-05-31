import * as THREE from './lib/three.js';

export function createWater() {
  const albedo = THREE.ImageUtils.loadTexture('./textures/seawater.jpg');
  const normalMap = THREE.ImageUtils.loadTexture(
    './textures/seawater_normals.jpg'
  );

  albedo.wrapS = THREE.RepeatWrapping;
  albedo.wrapT = THREE.RepeatWrapping;
  albedo.repeat.set(4, 4);

  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(4, 4);

  const material = new THREE.MeshPhysicalMaterial({
    color: 0x1f3a4d,
    map: albedo,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.8, 0.8),
    transparent: true,
    roughness: 0.1,
    transparency: 0.35,
    reflectivity: 1.1
  });

  const declarationsGLSL = 'uniform float time, frequency, amplitude;\n';

  // Transforms vertices to form a sine wave pattern, and calculates normals so lighting isn't screwed up.
  // This equation is used to calculate surface normals:
  // https://stackoverflow.com/questions/9577868/glsl-calculate-surface-normal
  const vertexGLSL = `
    vec3 transformed = vec3(position);
    float angle = (time + position.x) * frequency;
    transformed.z += sin(angle) * amplitude;

    objectNormal = normalize(vec3(-amplitude * frequency * cos(angle), 0.0, 1.0));
    vNormal = normalMatrix * objectNormal;
  `;

  const waterObj = {};
  material.onBeforeCompile = (shader) => {
    shader.uniforms.time = { value: 0 };
    shader.uniforms.frequency = { value: 0.01 };
    shader.uniforms.amplitude = { value: 20.0 };

    // Add new declarations to top of existing shader code
    shader.vertexShader = declarationsGLSL + shader.vertexShader;
    // Replace dummy vertex shader code with custom code
    // (see https://blog.mozvr.com/customizing-vertex-shaders/)
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      vertexGLSL
    );

    // Store reference to shader so that values can be changed later
    waterObj.shader = shader;
  };
  const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2000, 2000, 100, 100),
    material
  );

  plane.rotation.x = (-90 * Math.PI) / 180;

  waterObj.plane = plane;
  waterObj.material = material;
  return waterObj;
}

export function updateWater({ plane, shader, material }, time) {
  if (!shader) {
    console.log('Water shader still compiling...');
    return;
  }

  shader.uniforms.time.value = 0.2 * time;

  const texturePanSpd = 0.00004;
  material.normalMap.offset.set(texturePanSpd * time, 0);
  material.map.offset.set(texturePanSpd * time, 0);
}
