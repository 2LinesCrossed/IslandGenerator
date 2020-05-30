import * as THREE from './lib/three.js';

export function createParticleSystem() {
  var count = 500;
  var size = 3000;
  var particles = new THREE.Geometry();
  var material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 30
  });

  // Create individual particles and position them randomly
  // Using "- size / 2" means the scattering will be centered on the origin
  for (let i = 0; i < count; i++) {
    // Create point
    var point = new THREE.Vector3(
      Math.random() * size - size / 2,
      Math.random() * size - size / 2,
      Math.random() * size - size / 2
    );

    // Add point as vertex
    particles.vertices.push(point);
  }

  return new THREE.Points(particles, material);
}
