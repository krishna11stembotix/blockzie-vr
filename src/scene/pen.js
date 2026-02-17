//  blockzie-vr/src/scene/pen.js

import * as THREE from 'three';
import { scene } from './scene.js';
import { isPenDown, getPenColor, getPenWidth } from '../runtime/pen_state.js';

// Store drawing lines
const drawingLines = [];
let currentLinePoints = [];
let currentLine = null;

/**
 * Start a new line segment
 */
export function startNewLine(position, color, width) {
    currentLinePoints = [position.clone()];

    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        linewidth: width // Note: linewidth > 1 only works in WebGL renderer on some platforms
    });

    currentLine = new THREE.Line(geometry, material);
    scene.add(currentLine);
    drawingLines.push(currentLine);
}

/**
 * Add a point to the current line
 */
export function addPointToLine(position) {
    if (!currentLine) return;

    currentLinePoints.push(position.clone());

    // Update geometry
    const positions = new Float32Array(currentLinePoints.length * 3);
    currentLinePoints.forEach((point, i) => {
        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z;
    });

    currentLine.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    currentLine.geometry.attributes.position.needsUpdate = true;
}

/**
 * End the current line
 */
export function endCurrentLine() {
    currentLine = null;
    currentLinePoints = [];
}

/**
 * Update pen drawing based on robot position
 */
export function updatePenDrawing(robotPosition) {
    if (!isPenDown()) {
        if (currentLine) {
            endCurrentLine();
        }
        return;
    }

    // Pen is down
    const penPosition = robotPosition.clone();
    penPosition.y = 0.01; // Just above the ground

    if (!currentLine) {
        // Start a new line
        startNewLine(penPosition, getPenColor(), getPenWidth());
    } else {
        // Add point to existing line
        const lastPoint = currentLinePoints[currentLinePoints.length - 1];
        const distance = penPosition.distanceTo(lastPoint);

        // Only add point if robot has moved enough (prevents duplicate points)
        if (distance > 0.01) {
            addPointToLine(penPosition);
        }
    }
}

/**
 * Clear all drawings
 */
export function clearDrawings() {
    drawingLines.forEach(line => {
        scene.remove(line);
        line.geometry.dispose();
        line.material.dispose();
    });
    drawingLines.length = 0;
    endCurrentLine();
}

/**
 * Fill area with color (simplified implementation)
 * In a full implementation, this would use flood fill or polygon detection
 */
export function fillArea(color) {
    console.log(`Fill area with color ${color} - Feature not yet fully implemented`);
    // TODO: Implement proper area filling
    // This would require:
    // 1. Detecting enclosed areas from line drawings
    // 2. Creating a mesh to fill the area
    // 3. Applying the color to the mesh
}
