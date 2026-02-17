//  bloczie-vr/src/runtime/drivetrain_state.js

/**
 * Drivetrain State Manager
 * Manages all drivetrain-related state including position, heading, rotation, and velocities
 */

const drivetrainState = {
    // Position tracking (in grid units)
    position: { x: 0, y: 0, z: 0 },

    // Heading: absolute orientation in degrees (0-359.99)
    // 0° = North (-Z), 90° = East (+X), 180° = South (+Z), 270° = West (-X)
    heading: 0,

    // Rotation: cumulative rotation since start (positive = clockwise, negative = counterclockwise)
    rotation: 0,

    // Velocity settings (0-100%)
    driveVelocity: 50,
    turnVelocity: 50,

    // Timeout for movement commands (in seconds, 0 = no timeout)
    timeout: 0,

    // Motion state
    isMoving: false,
    isDone: true,
    currentCommand: null
};

/**
 * Normalize angle to 0-359.99 range
 */
function normalizeHeading(degrees) {
    let normalized = degrees % 360;
    if (normalized < 0) normalized += 360;
    return normalized;
}

/**
 * Get current drivetrain state (read-only copy)
 */
export function getDrivetrainState() {
    return { ...drivetrainState };
}

/**
 * Set drive velocity (0-100%)
 */
export function setDriveVelocity(percent) {
    drivetrainState.driveVelocity = Math.max(0, Math.min(100, percent));
}

/**
 * Set turn velocity (0-100%)
 */
export function setTurnVelocity(percent) {
    drivetrainState.turnVelocity = Math.max(0, Math.min(100, percent));
}

/**
 * Set absolute heading (will be normalized to 0-359.99)
 */
export function setDriveHeading(degrees) {
    drivetrainState.heading = normalizeHeading(degrees);
}

/**
 * Set cumulative rotation value
 */
export function setDriveRotation(degrees) {
    drivetrainState.rotation = degrees;
}

/**
 * Set timeout for movement commands (in seconds)
 */
export function setDriveTimeout(seconds) {
    drivetrainState.timeout = Math.max(0, seconds);
}

/**
 * Update heading based on rotation change
 */
export function updateHeading(deltaRotation) {
    drivetrainState.rotation += deltaRotation;
    drivetrainState.heading = normalizeHeading(drivetrainState.heading + deltaRotation);
}

/**
 * Update position based on movement
 */
export function updatePosition(deltaX, deltaY, deltaZ) {
    drivetrainState.position.x += deltaX;
    drivetrainState.position.y += deltaY;
    drivetrainState.position.z += deltaZ;
}

/**
 * Set motion state
 */
export function setMotionState(moving, done, command = null) {
    drivetrainState.isMoving = moving;
    drivetrainState.isDone = done;
    drivetrainState.currentCommand = command;
}

/**
 * Check if drive is done (for non-blocking commands)
 */
export function isDriveDone() {
    return drivetrainState.isDone;
}

/**
 * Check if drive is currently moving
 */
export function isDriveMoving() {
    return drivetrainState.isMoving;
}

/**
 * Get current heading (0-359.99°)
 */
export function getDriveHeading() {
    return drivetrainState.heading;
}

/**
 * Get cumulative rotation
 */
export function getDriveRotation() {
    return drivetrainState.rotation;
}

/**
 * Get current drive velocity
 */
export function getDriveVelocity() {
    return drivetrainState.driveVelocity;
}

/**
 * Get current turn velocity
 */
export function getTurnVelocity() {
    return drivetrainState.turnVelocity;
}

/**
 * Get current timeout setting
 */
export function getDriveTimeout() {
    return drivetrainState.timeout;
}

/**
 * Reset drivetrain state to initial values
 */
export function resetDrivetrainState() {
    drivetrainState.position = { x: 0, y: 0, z: 0 };
    drivetrainState.heading = 0;
    drivetrainState.rotation = 0;
    drivetrainState.driveVelocity = 50;
    drivetrainState.turnVelocity = 50;
    drivetrainState.timeout = 0;
    drivetrainState.isMoving = false;
    drivetrainState.isDone = true;
    drivetrainState.currentCommand = null;
}
