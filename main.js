import "./style.css";
import cubeFace from "/cube-face.png";
import cubeBody from "/cube-body.png";
// import characterModel from "/character.gltf";
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
const threeJsContainer = document.querySelector(".three-js-container");
threeJsContainer.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();
const materials = [
  new THREE.MeshBasicMaterial({ map: loader.load(cubeBody) }),
  new THREE.MeshBasicMaterial({ map: loader.load(cubeBody) }),
  new THREE.MeshBasicMaterial({ map: loader.load(cubeBody) }),
  new THREE.MeshBasicMaterial({ map: loader.load(cubeBody) }),
  new THREE.MeshBasicMaterial({ map: loader.load(cubeFace) }),
  new THREE.MeshBasicMaterial({ map: loader.load(cubeBody) }),
];

const geometry = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(geometry, materials);
// scene.add(cube);
camera.position.z = 5;

// Instantiate a loader
const gltfLoader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
// gltfLoader.setDRACOLoader( dracoLoader );

// Load a glTF resource
gltfLoader.load(
	// resource URL
	'/models/gltf/character.gltf',
	// called when the resource is loaded
	function ( gltf ) {
    const model = gltf.scene;

    // Scale the model to fit 100px x 100px
    const boundingBox = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    const desiredSize = 100; // 100px
    const scale = desiredSize / Math.max(size.x, size.y);
    model.scale.set(0.2,0.2,0.2);

    // Position the model
    model.position.set(0, 0, 0);
    scene.add(model);

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

function animate() {
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
