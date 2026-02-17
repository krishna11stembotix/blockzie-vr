//  blockzie-vr/src/runtime/sensor_state.js

// Sensor states
const sensorState = {
    bumpers: {
        left: false,
        right: false
    },
    distance: {
        front: {
            hasObject: false,
            distance: 2000 // mm, max range
        }
    },
    eye: {
        front: {
            hasObject: false,
            color: null, // 'red', 'green', 'blue', or null
            brightness: 0, // 0-100%
            hue: 0 // 0-360 degrees
        }
    }
};

// Event listeners for sensor events
const sensorEventListeners = {
    bumperPressed: [],
    bumperReleased: [],
    eyeDetects: [],
    eyeLoses: []
};

// ========== BUMPER FUNCTIONS ==========

/**
 * Set bumper state (simulated by UI buttons)
 */
export function setBumperState(bumper, pressed) {
    const wasPressed = sensorState.bumpers[bumper];
    sensorState.bumpers[bumper] = pressed;

    // Trigger events
    if (pressed && !wasPressed) {
        triggerBumperEvent(bumper, 'pressed');
    } else if (!pressed && wasPressed) {
        triggerBumperEvent(bumper, 'released');
    }

    console.log(`${bumper} bumper: ${pressed ? 'pressed' : 'released'}`);
}

/**
 * Check if bumper is pressed
 */
export function isBumperPressed(bumper) {
    return sensorState.bumpers[bumper] || false;
}

/**
 * Register bumper event listener
 */
export function onBumperEvent(bumper, state, callback) {
    const eventKey = `bumper_${bumper}_${state}`;
    if (!sensorEventListeners[eventKey]) {
        sensorEventListeners[eventKey] = [];
    }
    sensorEventListeners[eventKey].push(callback);
}

/**
 * Trigger bumper event
 */
function triggerBumperEvent(bumper, state) {
    const eventKey = `bumper_${bumper}_${state}`;
    const listeners = sensorEventListeners[eventKey] || [];
    listeners.forEach(callback => callback());
}

// ========== DISTANCE SENSOR FUNCTIONS ==========

/**
 * Set distance sensor reading
 */
export function setDistanceSensor(sensor, hasObject, distance) {
    sensorState.distance[sensor] = { hasObject, distance };
}

/**
 * Check if distance sensor found an object
 */
export function distanceFoundObject(sensor) {
    return sensorState.distance[sensor]?.hasObject || false;
}

/**
 * Get object distance from sensor
 */
export function getObjectDistance(sensor, unit = 'mm') {
    const distance = sensorState.distance[sensor]?.distance || 2000;
    if (unit === 'inches') {
        return distance / 25.4; // Convert mm to inches
    }
    return distance;
}

// ========== EYE SENSOR FUNCTIONS ==========

/**
 * Set eye sensor reading
 */
export function setEyeSensor(sensor, hasObject, color, brightness, hue) {
    const wasDetecting = sensorState.eye[sensor]?.hasObject || false;

    sensorState.eye[sensor] = {
        hasObject,
        color,
        brightness,
        hue
    };

    // Trigger events
    if (hasObject && !wasDetecting) {
        triggerEyeEvent(sensor, 'detects');
    } else if (!hasObject && wasDetecting) {
        triggerEyeEvent(sensor, 'loses');
    }
}

/**
 * Check if eye sensor is near an object
 */
export function eyeNearObject(sensor) {
    return sensorState.eye[sensor]?.hasObject || false;
}

/**
 * Check if eye sensor detects a specific color
 */
export function eyeDetectsColor(sensor, color) {
    const detectedColor = sensorState.eye[sensor]?.color;
    return detectedColor === color;
}

/**
 * Get eye sensor brightness
 */
export function getEyeBrightness(sensor) {
    return sensorState.eye[sensor]?.brightness || 0;
}

/**
 * Register eye event listener
 */
export function onEyeEvent(sensor, state, callback) {
    const eventKey = `eye_${sensor}_${state}`;
    if (!sensorEventListeners[eventKey]) {
        sensorEventListeners[eventKey] = [];
    }
    sensorEventListeners[eventKey].push(callback);
}

/**
 * Trigger eye event
 */
function triggerEyeEvent(sensor, state) {
    const eventKey = `eye_${sensor}_${state}`;
    const listeners = sensorEventListeners[eventKey] || [];
    listeners.forEach(callback => callback());
}

// ========== LOCATION FUNCTIONS ==========
// Location is handled by drivetrain_state.js, but we'll add helper functions here

/**
 * Get robot position
 */
export function getPosition(axis, unit = 'mm') {
    // This will be integrated with the robot's actual position from scene
    // For now, return placeholder
    return 0;
}

/**
 * Get robot angle
 */
export function getPositionAngle() {
    // This will be integrated with drivetrain heading
    // For now, return placeholder
    return 0;
}
