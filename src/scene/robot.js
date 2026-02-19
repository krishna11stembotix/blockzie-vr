//  blockzie-vr/src/scene/robot.js

import { scene } from './scene.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {
    updateHeading,
    updatePosition,
    setMotionState,
    getDriveVelocity,
    getTurnVelocity,
    getDriveHeading
} from '../runtime/drivetrain_state.js';
import { updatePenDrawing } from './pen.js';

let robotMesh;
// Target states for animation
const targetPosition = new THREE.Vector3(0, 0, 0); // Start at 0,0,0 (on grid)
// Adjust Y in the loader 

const targetRotation = new THREE.Euler(0, 0, 0);

// Motion state for continuous and async movements
let continuousMotion = null; // { type: 'drive'|'turn', direction: 'forward'|'reverse'|'left'|'right' }
let activeMovement = null; // Promise for tracking async movements

export function initRobot() {
    const loader = new GLTFLoader();
    loader.load('./src/assets/stembot.glb', function (gltf) {
        robotMesh = gltf.scene;

        // Normalize scale (robots can be huge)
        // Bounding box check
        const box = new THREE.Box3().setFromObject(robotMesh);
        const size = box.getSize(new THREE.Vector3());
        // Scale to roughly 1 unit high
        const scaleFactor = 1 / size.y;
        robotMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Position on ground (assuming origin is center, we want feet on ground)
        // If origin is center, we need to raise it by half height.
        // Actually usually 0 is fine if the model is rigged well.
        // Let's assume 0.

        robotMesh.position.copy(targetPosition);

        scene.add(robotMesh);
        console.log("Robot loaded");
    }, undefined, function (error) {
        console.error("An error occurred loading the robot:", error);
        // Fallback to cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshNormalMaterial();
        robotMesh = new THREE.Mesh(geometry, material);
        robotMesh.position.copy(targetPosition);
        robotMesh.position.y = 0.5; // Sit on grid
        scene.add(robotMesh);
    });
}

export function updateRobot() {
    if (!robotMesh) return;

    // Handle continuous motion
    if (continuousMotion) {
        if (continuousMotion.type === 'drive') {
            const direction = continuousMotion.direction === 'forward' ? 1 : -1;
            const velocity = getDriveVelocity() / 100;
            const forwardVector = new THREE.Vector3(0, 0, -direction * 0.02 * velocity);
            forwardVector.applyEuler(targetRotation);
            targetPosition.add(forwardVector);
        } else if (continuousMotion.type === 'turn') {
            const direction = continuousMotion.direction === 'left' ? 1 : -1;
            const velocity = getTurnVelocity() / 100;
            const deltaRotation = direction * 2 * velocity; // degrees per frame
            targetRotation.y += THREE.MathUtils.degToRad(deltaRotation);
            updateHeading(deltaRotation);
        }
    }

    // Smoothly interpolate position
    robotMesh.position.lerp(targetPosition, 0.1);

    // Smoothly interpolate rotation
    const currentQ = robotMesh.quaternion;
    const targetQ = new THREE.Quaternion().setFromEuler(targetRotation);
    robotMesh.quaternion.slerp(targetQ, 0.1);

    // Update pen drawing
    updatePenDrawing(robotMesh.position);
}

// ========== BASIC MOVEMENT (Legacy) ==========
export function moveForward() {
    // Determine forward vector based on current TARGET rotation (grid based)
    // Assuming 0 rotation is facing -Z (standard)
    // Check model facing. Often models face +Z. We might need to rotate the mesh container.
    // For now assume standard -Z forward.
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyEuler(targetRotation);
    direction.round();
    targetPosition.add(direction);
}

export function turnRight() {
    const deltaRotation = -90;
    targetRotation.y -= Math.PI / 2;
    updateHeading(deltaRotation);
}

export function turnLeft() {
    const deltaRotation = 90;
    targetRotation.y += Math.PI / 2;
    updateHeading(deltaRotation);
}

// ========== ADVANCED DRIVETRAIN FUNCTIONS ==========

/**
 * Start continuous driving (forward or reverse)
 */
export function startDriving(direction) {
    continuousMotion = { type: 'drive', direction };
    setMotionState(true, false, 'drive');
}

/**
 * Start continuous turning (left or right)
 */
export function startTurning(direction) {
    continuousMotion = { type: 'turn', direction };
    setMotionState(true, false, 'turn');
}

/**
 * Stop all drivetrain motion
 */
export function stopDriving() {
    continuousMotion = null;
    setMotionState(false, true, null);
}

/**
 * Drive a specific distance
 * @param {string} direction - 'forward' or 'reverse'
 * @param {number} distance - Distance value
 * @param {string} unit - 'mm' or 'inches'
 * @returns {Promise} Resolves when movement completes
 */
export function driveDistance(direction, distance, unit) {
    return new Promise((resolve) => {
        // Convert distance to grid units (1 grid unit = 100mm)
        let gridUnits = distance / 100;
        if (unit === 'inches') {
            gridUnits = (distance * 25.4) / 100; // Convert inches to mm, then to grid units
        }

        const directionMultiplier = direction === 'forward' ? 1 : -1;
        const velocity = getDriveVelocity() / 100;

        // Calculate target position
        const moveVector = new THREE.Vector3(0, 0, -directionMultiplier * gridUnits);
        moveVector.applyEuler(targetRotation);
        targetPosition.add(moveVector);

        // Update state
        updatePosition(moveVector.x, moveVector.y, moveVector.z);
        setMotionState(true, false, 'drive_for');

        // Calculate duration based on velocity (slower = longer)
        const baseDuration = Math.abs(gridUnits) * 600; // 600ms per grid unit at 100% speed
        const duration = baseDuration / velocity;

        setTimeout(() => {
            setMotionState(false, true, null);
            resolve();
        }, duration);
    });
}

/**
 * Turn a specific angle
 * @param {string} direction - 'left' or 'right'
 * @param {number} angle - Angle in degrees
 * @returns {Promise} Resolves when rotation completes
 */
export function turnAngle(direction, angle) {
    return new Promise((resolve) => {
        const directionMultiplier = direction === 'left' ? 1 : -1;
        const deltaRotation = directionMultiplier * angle;
        const velocity = getTurnVelocity() / 100;

        targetRotation.y += THREE.MathUtils.degToRad(deltaRotation);
        updateHeading(deltaRotation);
        setMotionState(true, false, 'turn_for');

        // Calculate duration based on velocity
        const baseDuration = Math.abs(angle) * 10; // 10ms per degree at 100% speed
        const duration = baseDuration / velocity;

        setTimeout(() => {
            setMotionState(false, true, null);
            resolve();
        }, duration);
    });
}

/**
 * Turn to an absolute heading
 * @param {number} targetHeading - Target heading in degrees (0-360)
 * @returns {Promise} Resolves when rotation completes
 */
export function turnToHeading(targetHeading) {
    return new Promise((resolve) => {
        const currentHeading = getDriveHeading();

        // Normalize target heading
        let normalizedTarget = targetHeading % 360;
        if (normalizedTarget < 0) normalizedTarget += 360;

        // Calculate shortest rotation
        let deltaRotation = normalizedTarget - currentHeading;
        if (deltaRotation > 180) deltaRotation -= 360;
        if (deltaRotation < -180) deltaRotation += 360;

        const velocity = getTurnVelocity() / 100;

        targetRotation.y += THREE.MathUtils.degToRad(deltaRotation);
        updateHeading(deltaRotation);
        setMotionState(true, false, 'turn_to_heading');

        // Calculate duration
        const baseDuration = Math.abs(deltaRotation) * 10;
        const duration = baseDuration / velocity;

        setTimeout(() => {
            setMotionState(false, true, null);
            resolve();
        }, duration);
    });
}

/**
 * Turn to a cumulative rotation value
 * @param {number} targetRotation - Target cumulative rotation in degrees
 * @returns {Promise} Resolves when rotation completes
 */
export function turnToRotation(targetRotationDegrees) {
    return new Promise((resolve) => {
        const currentRotation = getDriveHeading(); // This should actually get cumulative rotation
        const deltaRotation = targetRotationDegrees - currentRotation;
        const velocity = getTurnVelocity() / 100;

        targetRotation.y += THREE.MathUtils.degToRad(deltaRotation);
        updateHeading(deltaRotation);
        setMotionState(true, false, 'turn_to_rotation');

        // Calculate duration
        const baseDuration = Math.abs(deltaRotation) * 10;
        const duration = baseDuration / velocity;

        setTimeout(() => {
            setMotionState(false, true, null);
            resolve();
        }, duration);
    });
}

// Reset logic if needed
export function resetRobot() {
    targetPosition.set(0, 0, 0);
    targetRotation.set(0, 0, 0);
    continuousMotion = null;
    if (robotMesh) {
        robotMesh.position.copy(targetPosition);
        robotMesh.rotation.set(0, 0, 0);
    }
    setMotionState(false, true, null);
}

/**
 * Returns the robot mesh object for position tracking.
 */
export function getRobotMesh() {
    return robotMesh;
}
