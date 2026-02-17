//  blockzie-vr/src/main.js


import { scene, camera, renderer } from './scene/scene.js';
import { initRobot, updateRobot, resetRobot as resetRobotScene } from './scene/robot.js';
import { addToQueue, clearQueue, runCommands, commandQueue, stopExecution } from './runtime/executor.js';
import {
    setDriveVelocity,
    setTurnVelocity,
    setDriveHeading,
    setDriveRotation,
    setDriveTimeout,
    isDriveDone,
    isDriveMoving,
    getDriveHeading,
    getDriveRotation
} from './runtime/drivetrain_state.js';
import {
    setBumperState,
    isBumperPressed,
    onBumperEvent,
    distanceFoundObject,
    getObjectDistance,
    eyeNearObject,
    eyeDetectsColor,
    getEyeBrightness,
    onEyeEvent,
    getPosition
} from './runtime/sensor_state.js';
import {
    printToConsole,
    setCursorToNextRow,
    clearAllRows,
    setPrintPrecision,
    setPrintColor
} from './runtime/console_state.js';
import {
    resetTimer,
    getTimerSeconds,
    onTimerEvent,
    checkTimerEvents,
    initTimer
} from './runtime/timer_state.js';
import {
    onEvent,
    broadcastEvent,
    broadcastEventAndWait,
    clearEventListeners
} from './runtime/events_state.js';

// Setup Three.js scene
const sceneContainer = document.getElementById("scene");
// Clear previous if any (though usually empty on load)
// sceneContainer.innerHTML = '';
sceneContainer.appendChild(renderer.domElement);

// Initialize robot
initRobot();

// Animation Loop
// Animation Loop
renderer.setAnimationLoop(function () {
    updateRobot();
    checkTimerEvents(); // Check for timer events
    renderer.render(scene, camera);
});
// animate(); removed

// Initialize Blockly
const workspace = Blockly.inject("blocklyDiv", {
    toolbox: document.getElementById("toolbox"),
});

// Make available globally for eval'd code
window.addToQueue = addToQueue;
window.setDriveVelocity = setDriveVelocity;
window.setTurnVelocity = setTurnVelocity;
window.setDriveHeading = setDriveHeading;
window.setDriveRotation = setDriveRotation;
window.setDriveTimeout = setDriveTimeout;
window.isDriveDone = isDriveDone;
window.isDriveMoving = isDriveMoving;
window.getDriveHeading = getDriveHeading;
window.getDriveRotation = getDriveRotation;

// Sensor functions
window.isBumperPressed = isBumperPressed;
window.onBumperEvent = onBumperEvent;
window.distanceFoundObject = distanceFoundObject;
window.getObjectDistance = getObjectDistance;
window.eyeNearObject = eyeNearObject;
window.eyeDetectsColor = eyeDetectsColor;
window.getEyeBrightness = getEyeBrightness;
window.onEyeEvent = onEyeEvent;
window.getPosition = getPosition;

// Console functions
window.printToConsole = printToConsole;
window.setCursorToNextRow = setCursorToNextRow;
window.clearAllRows = clearAllRows;
window.setPrintPrecision = setPrintPrecision;
window.setPrintColor = setPrintColor;

// Timer functions
window.resetTimer = resetTimer;
window.getTimerSeconds = getTimerSeconds;
window.onTimerEvent = onTimerEvent;

// Events functions
window.onEvent = onEvent;
window.broadcastEvent = broadcastEvent;
window.broadcastEventAndWait = broadcastEventAndWait;

// Define the run function called by the button
window.runCode = function () {
    console.log("Run clicked");
    clearQueue();
    initTimer(); // Initialize timer
    clearEventListeners(); // Clear previous event listeners

    // Generate code from blocks
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    console.log("Generated Code:", code);

    try {
        // Evaluate the code to populate the queue
        eval(code);
        // Start processing the queue
        runCommands();
    } catch (e) {
        console.error(e);
        alert("Error running code: " + e);
    }
};

// Stop code execution
window.stopCode = function () {
    console.log("Stop clicked");
    stopExecution();
    clearQueue();
    // Stop any ongoing robot movement
    import('./scene/robot.js').then(module => {
        module.stopDriving();
    });
};

// Reset robot to starting position
window.resetRobot = function () {
    console.log("Reset clicked");
    clearQueue();
    resetRobotScene();
    // Reset sensor states
    setBumperState('left', false);
    setBumperState('right', false);
};

// Exit VR mode (placeholder for future VR implementation)
window.exitVR = function () {
    console.log("Exit VR clicked");
    alert("VR mode not yet implemented. This will exit VR mode in the future.");
};

// Bumper button handlers
window.pressBumper = function (bumper) {
    console.log(`${bumper} bumper pressed`);
    setBumperState(bumper, true);
    const btnId = bumper === 'left' ? 'left-bumper-btn' : 'right-bumper-btn';
    document.getElementById(btnId).classList.add('pressed');
};

window.releaseBumper = function (bumper) {
    console.log(`${bumper} bumper released`);
    setBumperState(bumper, false);
    const btnId = bumper === 'left' ? 'left-bumper-btn' : 'right-bumper-btn';
    document.getElementById(btnId).classList.remove('pressed');
};

// Handle window resize for scene
// (Already handled in scene.js listener, but good to ensure renderer attachment keeps size)
