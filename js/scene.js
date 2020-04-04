var width = window.innerWidth;
var height = window.innerHeight;

//Scene Setup

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
var cameraTarget = { x: 0, y: 0, z: 0 };
camera.position.y = 70;
camera.position.z = 1000;
camera.rotation.x = (-15 * Math.PI) / 180;

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xc3dde5, 100);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

/*var stats = new Stats();
	stats.showPanel( 0 );
	document.body.appendChild( stats.dom); */

var light = new THREE.DirectionalLight(0xffffff, 2);
light.position
  .set(camera.position.x, camera.position.y + 500, camera.position.z + 500)
  .normalize();
scene.add(light);

//this function is called when the window is resized
var MyResize = function () {
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
};

//Terrain setup
var geometry = new THREE.PlaneBufferGeometry(2000, 2000, 256, 256);
var material = new THREE.MeshLambertMaterial({ color: 0x3c3951 });
var terrain = new THREE.Mesh(geometry, material);
terrain.rotation.x = -Math.PI / 2;
scene.add(terrain);

//Change the peak value for different sizes.
var perlin = new Perlin();
var peak = 60;
//var smoothing = 300; //Necessary for the perlin smoothing
//function refreshVertices(){
var vertices = terrain.geometry.attributes.position.array;
for (var i = 0; i <= vertices.length; i += 3) {
  vertices[i + 2] = peak * Math.random();

  /*vertices[i+2] = peak * perlin.noise(
				(vertices[i])/smoothing,
				(vertices[i+1])/smoothing 
			);*/
}

terrain.geometry.attributes.position.needsUpdate = true;
terrain.geometry.computeVertexNormals();
//}
/*
	int cols, rows;
	int scl = 20; 
	for (int x  = 0; x < cols; x++) {
		for (int y = 0; y < rows; y++) {
		
		}
	} 
	*/
function render() {
  renderer.render(scene, camera);
}
function loop() {
  //update();
  render();
}

loop();

window.addEventListener("resize", MyResize);
