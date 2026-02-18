import * as THREE from 'three';
import { scene } from './scene/scene.js'; // Import scene to add goals
import { resetRobot } from './scene/robot.js';
import { stopExecution, clearQueue } from './runtime/executor.js';

export let currentMission = null;
export let missionGoal = null;
let missionActive = false;

// Initialize mission logic bridge
if (window.missionLogic) {
    window.missionLogic.startMission = startMission;
}

/**
 * Starts a specific mission.
 * @param {number} id 
 */
export function startMission(id) {
    console.log(`Initializing Mission ${id}...`);
    currentMission = id;
    missionActive = true;

    // Reset the robot and scene state
    stopExecution();
    clearQueue();
    resetRobot();

    // Clear existing goals
    if (missionGoal) {
        scene.remove(missionGoal);
        missionGoal = null;
    }

    // Hide completion overlay if open
    const completeOverlay = document.getElementById('missionComplete');
    if (completeOverlay) completeOverlay.style.display = 'none';

    // Create new goal based on mission ID
    if (id === 1) {
        createMissionGoal(scene);
        updateInstruction("Goal: Reach the Glowing Crystal");
    }
}

function updateInstruction(text) {
    const el = document.getElementById('missionInstruction');
    if (el) {
        el.innerText = text;
        el.style.display = 'block';
    }
}

/**
 * Creates a glowing crystal in the scene for Mission 1.
 * @param {THREE.Scene} scene 
 */
export function createMissionGoal(scene) {
    // Mission 1: Reach the glowing crystal
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8
    });

    missionGoal = new THREE.Mesh(geometry, material);

    // Position it slightly in front of the robot's starting point
    // Robot usually starts at 0,0,0. Let's put the crystal at x:0, z:-5
    missionGoal.position.set(0, 0.5, -5);

    // Add a point light to make it "glow" in the environment
    const light = new THREE.PointLight(0x00ffff, 1, 5);
    missionGoal.add(light);

    scene.add(missionGoal);
    console.log("Mission 1 goal created at", missionGoal.position);
}

/**
 * Checks if the robot has reached the mission goal.
 * @param {THREE.Object3D} robotMesh 
 */
export function checkMissionComplete(robotMesh) {
    if (!missionActive || !missionGoal || !robotMesh) return;

    const distance = robotMesh.position.distanceTo(missionGoal.position);

    if (distance < 1) {
        showMissionComplete();
        missionActive = false; // Stop further checking
    }
}

function showMissionComplete() {
    const overlay = document.getElementById('missionComplete');
    if (overlay) {
        overlay.style.display = 'block';
    }
    console.log("Mission Complete!");
}
