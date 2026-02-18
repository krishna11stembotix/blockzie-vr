
import * as THREE from 'three';
import { scene } from './scene.js';
import { raycaster, controllers } from './vr_controllers.js';

let uiMesh = null;
let missionCompleteMesh = null;
let canvas = null;
let context = null;

const UI_WIDTH = 512;
const UI_HEIGHT = 256;

/**
 * Initializes the VR UI panel.
 */
export function initVRUI() {
    canvas = document.createElement('canvas');
    canvas.width = UI_WIDTH;
    canvas.height = UI_HEIGHT;
    context = canvas.getContext('2d');

    drawUI();

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const geometry = new THREE.PlaneGeometry(1, 0.5);

    uiMesh = new THREE.Mesh(geometry, material);
    uiMesh.position.set(0, 1.5, -2); // Floats in front of the user
    uiMesh.rotation.x = -0.1;
    scene.add(uiMesh);

    // Create Mission Complete Mesh (Hidden initially)
    const mcCanvas = document.createElement('canvas');
    mcCanvas.width = 512;
    mcCanvas.height = 128;
    const mcContext = mcCanvas.getContext('2d');

    // Draw background
    mcContext.fillStyle = 'rgba(0, 255, 0, 0.8)';
    mcContext.fillRect(0, 0, 512, 128);

    // Draw border
    mcContext.strokeStyle = 'white';
    mcContext.lineWidth = 5;
    mcContext.strokeRect(0, 0, 512, 128);

    // Draw text
    mcContext.font = 'bold 40px Arial';
    mcContext.fillStyle = 'white';
    mcContext.textAlign = 'center';
    mcContext.textBaseline = 'middle';
    mcContext.fillText("Mission Complete!", 256, 64);

    const mcTexture = new THREE.CanvasTexture(mcCanvas);
    const mcMaterial = new THREE.MeshBasicMaterial({ map: mcTexture, transparent: true });
    const mcGeometry = new THREE.PlaneGeometry(1, 0.25);

    missionCompleteMesh = new THREE.Mesh(mcGeometry, mcMaterial);
    missionCompleteMesh.position.set(0, 2, -2.5);
    missionCompleteMesh.visible = false;
    scene.add(missionCompleteMesh);
}

function drawUI(hoverState = null) {
    if (!context) return;

    // Background
    context.fillStyle = 'rgba(20, 20, 20, 0.8)';
    context.fillRect(0, 0, UI_WIDTH, UI_HEIGHT);
    context.strokeStyle = '#FF8C00';
    context.lineWidth = 5;
    context.strokeRect(0, 0, UI_WIDTH, UI_HEIGHT);

    // Button 1: Run Code
    drawButton(context, 50, 50, 412, 60, "▶ RUN CODE", hoverState === 'run');

    // Button 2: Exit VR
    drawButton(context, 50, 140, 412, 60, "🚪 EXIT VR", hoverState === 'exit');

    if (uiMesh && uiMesh.material.map) {
        uiMesh.material.map.needsUpdate = true;
    }
}

function drawButton(ctx, x, y, w, h, text, isHovered) {
    ctx.fillStyle = isHovered ? '#FF8C00' : '#333';
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + h / 2);
}

/**
 * Updates VR UI interaction.
 */
export function updateVRUI() {
    if (!uiMesh || !raycaster || controllers.length === 0) return;

    // Raycast against the UI mesh
    const intersects = raycaster.intersectObject(uiMesh);

    if (intersects.length > 0) {
        const uv = intersects[0].uv;
        const x = uv.x * UI_WIDTH;
        const y = (1 - uv.y) * UI_HEIGHT;

        let hovered = null;

        // Check button bounds
        if (x > 50 && x < 462) {
            if (y > 50 && y < 110) {
                hovered = 'run';
            } else if (y > 140 && y < 200) {
                hovered = 'exit';
            }
        }

        drawUI(hovered);

        // Check for click (trigger press)
        // We need to check if the controller is selecting
        const controller = controllers[0]; // Assuming primary controller
        // Note: Actual click detection usually requires event listeners on 'selectstart'
        // But for simplicity in this loop, we might rely on a global 'isSelecting' flag 
        // managed in vr_controllers.js or main.js. 
        // OR we can check gamepad state if available, but WebXR input source 'select' event is better.
    } else {
        drawUI(null);
    }
}

/**
 * Handles controller selection events for the UI.
 * Call this when a controller emits a 'select' event.
 */
export function handleVRUISelect() {
    if (!uiMesh || !raycaster) return;

    const intersects = raycaster.intersectObject(uiMesh);

    if (intersects.length > 0) {
        const uv = intersects[0].uv;
        const x = uv.x * UI_WIDTH;
        const y = (1 - uv.y) * UI_HEIGHT;

        // Check button bounds
        if (x > 50 && x < 462) {
            if (y > 50 && y < 110) {
                console.log("VR UI: Run Code clicked");
                if (window.runCode) window.runCode();
            } else if (y > 140 && y < 200) {
                console.log("VR UI: Exit VR clicked");
                if (window.exitVR) window.exitVR();
            }
        }
    }
}

export function showVRMissionComplete() {
    if (missionCompleteMesh) {
        missionCompleteMesh.visible = true;
        setTimeout(() => {
            if (missionCompleteMesh) missionCompleteMesh.visible = false;
        }, 3000);
    }
}
