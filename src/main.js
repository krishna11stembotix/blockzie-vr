//  blockzie-vr/src/main.js

import {
    scene, camera, renderer,
    initOrbitControls, updateOrbitControls,
    enterVRHeadset, exitVRHeadset, isVRPresenting,
    enterSimulatedVR, exitSimulatedVR, isSimulatedVR,
    tickSimulatedVR,
    resizeRenderer
} from './scene/scene.js';
import { initRobot, updateRobot, resetRobot as resetRobotScene } from './scene/robot.js';
import { addToQueue, clearQueue, runCommands, stopExecution } from './runtime/executor.js';
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

// ── Mount renderer into #scene container ──
const sceneContainer = document.getElementById('scene');
sceneContainer.appendChild(renderer.domElement);
renderer.domElement.style.display = 'block';
renderer.domElement.style.width   = '100%';
renderer.domElement.style.height  = '100%';
resizeRenderer();

// ── Orbit controls (desktop default view) ──
initOrbitControls();

// ── Robot ──
initRobot();

// ── Simulated VR hint overlay ──
// Injected dynamically so it lives inside #scene
(function injectSimVRHint() {
    const hint = document.createElement('div');
    hint.id = 'vr-sim-hint';
    hint.style.cssText = `
        display: none;
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(13,27,42,0.90);
        color: #fff;
        font-size: 13px;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        padding: 8px 18px;
        border-radius: 6px;
        border: 1px solid #FF8C00;
        z-index: 100;
        align-items: center;
        gap: 12px;
        pointer-events: none;
        white-space: nowrap;
    `;
    hint.innerHTML =
        '🥽 <strong>Simulated VR</strong>&nbsp;&nbsp;' +
        'WASD / Arrows = move &nbsp;|&nbsp; Mouse = look &nbsp;|&nbsp;' +
        'Space = up &nbsp;|&nbsp; Shift = down &nbsp;|&nbsp;' +
        '<span style="color:#FF8C00;">Escape to exit</span>';
    sceneContainer.appendChild(hint);
})();

// Exit simulated VR automatically when pointer lock is released (user presses Esc)
document.addEventListener('pointerlockchange', () => {
    if (!document.pointerLockElement && isSimulatedVR()) {
        exitSimulatedVR();
    }
});

// ── Animation Loop ──
renderer.setAnimationLoop(function () {
    tickSimulatedVR();
    updateOrbitControls();
    updateRobot();
    checkTimerEvents();
    renderer.render(scene, camera);
});

// ── Blockly workspace ──
const workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox'),
});

// ── Global API exposed to eval'd block code ──
window.addToQueue = addToQueue;

window.setDriveVelocity  = setDriveVelocity;
window.setTurnVelocity   = setTurnVelocity;
window.setDriveHeading   = setDriveHeading;
window.setDriveRotation  = setDriveRotation;
window.setDriveTimeout   = setDriveTimeout;
window.isDriveDone       = isDriveDone;
window.isDriveMoving     = isDriveMoving;
window.getDriveHeading   = getDriveHeading;
window.getDriveRotation  = getDriveRotation;

window.isBumperPressed     = isBumperPressed;
window.onBumperEvent       = onBumperEvent;
window.distanceFoundObject = distanceFoundObject;
window.getObjectDistance   = getObjectDistance;
window.eyeNearObject       = eyeNearObject;
window.eyeDetectsColor     = eyeDetectsColor;
window.getEyeBrightness    = getEyeBrightness;
window.onEyeEvent          = onEyeEvent;
window.getPosition         = getPosition;

window.printToConsole     = printToConsole;
window.setCursorToNextRow  = setCursorToNextRow;
window.clearAllRows       = clearAllRows;
window.setPrintPrecision   = setPrintPrecision;
window.setPrintColor       = setPrintColor;

window.resetTimer      = resetTimer;
window.getTimerSeconds  = getTimerSeconds;
window.onTimerEvent    = onTimerEvent;

window.onEvent              = onEvent;
window.broadcastEvent        = broadcastEvent;
window.broadcastEventAndWait = broadcastEventAndWait;

// ── Button handlers ──

window.runCode = function () {
    console.log('Run clicked');
    clearQueue();
    initTimer();
    clearEventListeners();
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    console.log('Generated Code:', code);
    try {
        eval(code);
        runCommands();
    } catch (e) {
        console.error(e);
        alert('Error running code: ' + e);
    }
};

window.stopCode = function () {
    console.log('Stop clicked');
    stopExecution();
    clearQueue();
    import('./scene/robot.js').then(m => m.stopDriving());
};

window.resetRobot = function () {
    console.log('Reset clicked');
    clearQueue();
    resetRobotScene();
    setBumperState('left', false);
    setBumperState('right', false);
};

/**
 * Enter VR — HEADSET mode.
 * Bound to the toolbar "Enter VR" button (onclick="window.enterVR()").
 *
 * KEY POINT: enterVRHeadset() calls navigator.xr.requestSession() which MUST
 * be invoked within a real, visible-button user gesture. This function is
 * assigned directly as the onclick of the visible toolbar button, so the
 * browser trust chain is fully preserved.
 */
window.enterVR = async function () {
    console.log('Enter VR (Headset) clicked');
    await enterVRHeadset();
};

/**
 * Enter VR — SIMULATED / Desktop mode.
 * Bound to the "Enter VR (Simulated)" overlay button inside the 3D scene.
 * Activates first-person mouse-look + WASD movement on desktop, no headset needed.
 */
window.enterVRSimulated = function () {
    console.log('Enter VR (Simulated) clicked');
    enterSimulatedVR();
};

/**
 * Exit VR — works for both modes.
 * Called when the toolbar button switches to "Exit VR" during an active session.
 */
window.exitVR = async function () {
    console.log('Exit VR clicked');
    if (isSimulatedVR()) {
        exitSimulatedVR();
    } else if (isVRPresenting()) {
        await exitVRHeadset();
    }
};

window.pressBumper = function (bumper) {
    console.log(`${bumper} bumper pressed`);
    setBumperState(bumper, true);
    document.getElementById(bumper === 'left' ? 'left-bumper-btn' : 'right-bumper-btn')
        ?.classList.add('pressed');
};

window.releaseBumper = function (bumper) {
    console.log(`${bumper} bumper released`);
    setBumperState(bumper, false);
    document.getElementById(bumper === 'left' ? 'left-bumper-btn' : 'right-bumper-btn')
        ?.classList.remove('pressed');
};