import "./style.css";
import cubeFace from "/cube-face.png";
import cubeBody from "/cube-body.png";
import gridTextureImg from "/grid-texture.jpg";
// import characterModel from "/character.gltf";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

var player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };
var keyboard = {};

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

// Enable shadows in the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

const threeJsContainer = document.querySelector(".three-js-container");
threeJsContainer.appendChild(renderer.domElement);

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
  let meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50, 50, 50),
    // MeshBasicMaterial does not react to lighting, so we replace with MeshPhongMaterial
    new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false })
    // See threejs.org/examples/ for other material types
  );
  meshFloor.rotation.x -= Math.PI / 2;
  // Floor can have shadows cast onto it
  meshFloor.receiveShadow = true;
  scene.add(meshFloor);
}

// Function to add a cube
function addCube(height, width, position, material, soundUrl) {
  const geometry = new THREE.BoxGeometry(width, height, width);
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(position.x, position.y, position.z);
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);
  // addPositionalAudio(cube, soundUrl);
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

function hexToRgb(hex) {
  let bigint = parseInt(hex.slice(1), 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return [r, g, b];
}

// Helper function to convert an RGB array to a hex color
function rgbToHex(r, g, b) {
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
}

function rgbToColor(r,g,b){
  return (
    "0x" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
}

//function that lerps hex color from from one to another given an inital color and a final color and a step value
function lerpColor(amount) {
  console.log(amount);
  let startColor = "#FF0000"; // Red
  let endColor = "#0000FF"; // Blue

  // Convert hex colors to RGB
  let startRgb = hexToRgb(startColor);
  let endRgb = hexToRgb(endColor);

  // Linearly interpolate each RGB component
  let r = Math.round(startRgb[0] + (amount) * (endRgb[0] - startRgb[0]));
  let g = Math.round(startRgb[1] + (amount) * (endRgb[1] - startRgb[1]));
  let b = Math.round(startRgb[2] + (amount) * (endRgb[2] - startRgb[2]));

  // let threeColor = new THREE.Color(`rgb(,${r},${g},${b})`);
  let threeColor = new THREE.Color(r,g,b);

  console.log(`rgb(${r},${g},${b})`);

  console.log(threeColor);
  return threeColor;
}

// Function to add lighting
function addLighting() {
  // LIGHTS
  let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  for (let i = -20; i <= 20; i += 10) {
    let lerpAmount = (i - (-20)) / (20 - (-20));
    let light = new THREE.PointLight(lerpColor(lerpAmount), 0.5, 30);
    light.position.set(i, 20, 0);
    light.castShadow = true;
    // Will not light anything closer than 0.1 units or further than 25 units
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);

    let light2 = new THREE.PointLight(lerpColor(lerpAmount), 0.5, 30);
    light2.position.set(0, 20, i);
    light2.castShadow = true;
    // Will not light anything closer than 0.1 units or further than 25 units
    light2.shadow.camera.near = 0.1;
    light2.shadow.camera.far = 25;
    scene.add(light2);
  }
}

createFloor();
addLighting();

const cubeMaterial = new THREE.MeshPhongMaterial({
  color: 0xff4444,
  wireframe: false,
});
addCube(3, 1, { x: 0, y: 0.5, z: 0 }, cubeMaterial, "/sounds/beach.mp3");

const cubeMaterial2 = new THREE.MeshPhongMaterial({
  color: 0x88ffff,
  wireframe: false,
});
addCube(3, 1, { x: 5, y: 0.5, z: 0 }, cubeMaterial2, "/sounds/beach.mp3");

// Render loop
animate();
function animate() {
  requestAnimationFrame(animate);

  if (keyboard[87]) {
    // W key
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
  }
  if (keyboard[83]) {
    // S key
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
  }
  if (keyboard[65]) {
    // A key
    camera.position.x +=
      Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
  }
  if (keyboard[68]) {
    // D key
    camera.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
  }

  if (keyboard[37]) {
    // left arrow key
    camera.rotation.y -= player.turnSpeed;
  }
  if (keyboard[39]) {
    // right arrow key
    camera.rotation.y += player.turnSpeed;
  }

  renderer.render(scene, camera);
}

//check when the mouse moves and call the onMouseMove function
// document.addEventListener("mousemove", onMouseMove);

// function to rotate the cube to the mouse position so that the front side is face the mouse directions
function onMouseMove(event) {
  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = -(event.clientY / window.innerHeight) * 2 + 1;
  cube.rotation.x = -y;
  cube.rotation.y = x;
}

// document.addEventListener("keydown", function (event) {
//   switch (event.keyCode) {
//     case 87: // W
//       camera.position.z -= 0.1;
//       break;
//     case 65: // A
//       camera.position.x -= 0.1;
//       break;
//     case 83: // S
//       camera.position.z += 0.1;
//       break;
//     case 68: // D
//       camera.position.x += 0.1;
//       break;
//     case 37:
//       camera.rotation.y -= Math.PI * 0.01;
//       break;
//     case 39:
//       camera.rotation.y += Math.PI * 0.01;
//       break;
//   }
// });

function keyDown(event) {
  keyboard[event.keyCode] = true;
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
