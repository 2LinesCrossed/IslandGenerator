import * as THREE from './lib/three.js';

export function createWater() {
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x2ea1ff,
    transparent: true,
    roughness: 0.4,
    transparency: 0.3,
    reflectivity: 1.0
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
    new THREE.PlaneBufferGeometry(6000, 6000, 100, 100),
    material
  );

  plane.rotation.x = (-90 * Math.PI) / 180;

  waterObj.plane = plane;
  return waterObj;
}
