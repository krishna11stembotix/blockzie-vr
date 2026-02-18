
import * as THREE from 'three';
import { renderer, scene } from './scene.js';

export const controllers = [];
export const controllerGrips = [];

// Raycaster for UI interaction
export const raycaster = new THREE.Raycaster();
const tempMatrix = new THREE.Matrix4();

/**
 * Initializes VR controllers and adds them to the scene.
 */
export function initControllers() {
    // Controller 0
    const controller0 = renderer.xr.getController(0);
    scene.add(controller0);
    controllers.push(controller0);

    const controllerGrip0 = renderer.xr.getControllerGrip(0);
    // Note: We would ideally load a controller model here using XRControllerModelFactory
    // For now, we'll just track the grip position if needed, or leave it empty so we don't block on loading external assets.
    scene.add(controllerGrip0);
    controllerGrips.push(controllerGrip0);

    // Controller 1
    const controller1 = renderer.xr.getController(1);
    scene.add(controller1);
    controllers.push(controller1);

    const controllerGrip1 = renderer.xr.getControllerGrip(1);
    scene.add(controllerGrip1);
    controllerGrips.push(controllerGrip1);

    // Add visual rays to controllers
    controllers.forEach(controller => {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -5)
        ]);
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        const line = new THREE.Line(geometry, material);
        line.name = 'line';
        line.scale.z = 5;
        controller.add(line);
    });
}

/**
 * Updates the raycaster based on the first active controller.
 * Returns the controller that is being used for pointing, or null.
 */
export function updateControllerRaycaster() {
    if (controllers.length > 0) {
        const controller = controllers[0]; // Primary pointer
        tempMatrix.identity().extractRotation(controller.matrixWorld);
        raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
        return controller;
    }
    return null;
}
