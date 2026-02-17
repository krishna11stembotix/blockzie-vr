//  blockzie-vr/src/scene/scene.js

import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

export const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
// Initial position
camera.position.set(0, 2, 5); // Adjusted for VR (slightly lower/closer might be better, but 2m height is good for "standing")
camera.lookAt(0, 0, 0);

export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.xr.enabled = true; // Enable WebXR

// Add VR Button
document.body.appendChild(VRButton.createButton(renderer));

// Grid
const grid = new THREE.GridHelper(10, 10);
scene.add(grid);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    const width = window.innerWidth * 0.6; // Assuming 60% width for scene based on CSS
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}
