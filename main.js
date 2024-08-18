import "./style.css";
import cubeFace from "/cube-face.png";
import cubeBody from "/cube-body.png";
import gridTextureImg from "/grid-texture.jpg";
// import characterModel from "/character.gltf";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

var player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };

const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xD2B48C); // Light tan color
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, player.height, -5);
camera.lookAt(new THREE.Vector3(0, player.height, 0));
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const threeJsContainer = document.querySelector(".three-js-container");
threeJsContainer.appendChild(renderer.domElement);

// PointerLockControls for navigation
// const controls = new PointerLockControls(camera, document.body);
// document.addEventListener('click', () => {
//     controls.lock();
// });

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Audio listener
const listener = new THREE.AudioListener();
camera.add(listener);

const cubeTextureLoader = new THREE.TextureLoader();
const materials = [
  new THREE.MeshBasicMaterial({ map: cubeTextureLoader.load(cubeBody) }),
  new THREE.MeshBasicMaterial({ map: cubeTextureLoader.load(cubeBody) }),
  new THREE.MeshBasicMaterial({ map: cubeTextureLoader.load(cubeBody) }),
  new THREE.MeshBasicMaterial({ map: cubeTextureLoader.load(cubeBody) }),
  new THREE.MeshBasicMaterial({ map: cubeTextureLoader.load(cubeFace) }),
  new THREE.MeshBasicMaterial({ map: cubeTextureLoader.load(cubeBody) }),
];

const geometry = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(geometry, materials);
// scene.add(cube);
// camera.position.z = 5;

//Function to create the floor
function createFloor() {
  const floorGeometry = new THREE.PlaneGeometry(50, 50); // Width and height of the plane
  const floorMaterial = new THREE.MeshBasicMaterial({
    color: 0x999999,
    wireframe: true,
  }); // Color it gray for now
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  // Rotate the floor to be horizontal (plane geometries are vertical by default)
  floor.rotation.x += Math.PI / 2;

  // Add shadow properties to the floor
  floor.receiveShadow = true;

  scene.add(floor);
}

// Function to add a cube
function addCube(size, position, material, soundUrl) {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(position.x, position.y, position.z);
  cube.castShadow = true;
  scene.add(cube);
  addPositionalAudio(cube, soundUrl);
  return cube;
}

// Function to add positional audio to an object
function addPositionalAudio(object, soundUrl) {
  const sound = new THREE.PositionalAudio(listener);
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load(soundUrl, (buffer) => {
    sound.setBuffer(buffer);
    sound.setRefDistance(20);
    sound.play();
  });
  object.add(sound);
}

createFloor();

const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
addCube(1, { x: 0, y: 0.5, z: 0 }, cubeMaterial, "/sounds/beach.mp3");

const cubeMaterial2 = new THREE.MeshStandardMaterial({ color: 0xfffff });
addCube(1, { x: 5, y: 0.5, z: 0 }, cubeMaterial2, "/sounds/beach.mp3");

// Render loop
function animate() {
  requestAnimationFrame(animate);
  // controls.update();
  renderer.render(scene, camera);
}
animate();

//check when the mouse moves and call the onMouseMove function
// document.addEventListener("mousemove", onMouseMove);

// function to rotate the cube to the mouse position so that the front side is face the mouse directions
function onMouseMove(event) {
  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = -(event.clientY / window.innerHeight) * 2 + 1;
  cube.rotation.x = -y;
  cube.rotation.y = x;
}

document.addEventListener("keydown", function (event) {
  switch (event.keyCode) {
    case 87: // W
      camera.position.z -= 0.1;
      break;
    case 65: // A
      camera.position.x -= 0.1;
      break;
    case 83: // S
      camera.position.z += 0.1;
      break;
    case 68: // D
      camera.position.x += 0.1;
      break;
    case 37:
      camera.rotation.y -= Math.PI * 0.01;
      break;
    case 39:
      camera.rotation.y += Math.PI * 0.01;
      break;
  }
});

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
