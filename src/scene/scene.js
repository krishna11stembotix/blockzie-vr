//  blockzie-vr/src/scene/scene.js

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createCity } from './city.js';
// NOTE: VRButton is intentionally NOT used here. We call navigator.xr.requestSession()
// directly from a real user-gesture handler in main.js to satisfy browser security policy.

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd0dce8);

export const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.set(0, 2, 5);
camera.lookAt(0, 0, 0);

export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.xr.enabled = true; // Required for WebXR

// ── Environment ──
createCity(scene);

// ── Lighting ──
const ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

// ── Orbit Controls (desktop / normal view) ──
let orbitControls = null;

export function initOrbitControls() {
    if (orbitControls) return;
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target.set(0, 0, 0);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.update();
}

export function updateOrbitControls() {
    if (orbitControls && orbitControls.enabled) {
        orbitControls.update();
    }
}

// ── WebXR Headset VR ──
// We bypass Three.js VRButton entirely and call navigator.xr.requestSession()
// directly from the onclick handler of our own toolbar button.
// This is critical: browsers require requestSession() to be called
// synchronously (or in the same microtask chain) within a real user gesture.
// Hidden buttons that are programmatically .click()-ed do NOT qualify.

let _currentXRSession = null;

/**
 * Must be called directly from a visible button's onclick / event handler.
 * Requests an immersive-vr WebXR session and hands it to the Three.js renderer.
 */
export async function enterVRHeadset() {
    // 1. Check API availability
    if (!navigator.xr) {
        alert(
            'WebXR is not available in this browser.\n\n' +
            'To use a VR headset, open this page in:\n' +
            '  • Chrome or Edge on a PC with your headset connected\n' +
            '  • The Meta / Oculus Browser on your headset\n' +
            '  • Any WebXR-compatible browser\n\n' +
            'The page must also be served over HTTPS or localhost.'
        );
        return;
    }

    // 2. Check immersive-vr support (async, resolves before requestSession)
    let supported = false;
    try {
        supported = await navigator.xr.isSessionSupported('immersive-vr');
    } catch (_) {
        supported = false;
    }

    if (!supported) {
        alert(
            'Immersive VR is not supported on this device or browser.\n\n' +
            'Please ensure:\n' +
            '  • Your headset is connected and its runtime is running\n' +
            '  • You are using a WebXR-enabled browser\n' +
            '  • The page is served over HTTPS or localhost'
        );
        return;
    }

    // 3. Toggle: if a session is already active, end it
    if (_currentXRSession) {
        await _currentXRSession.end().catch(() => { });
        return;
    }

    // 4. Request the session — this MUST stay inside the user-gesture chain.
    //    The await on isSessionSupported above is safe because it doesn't break
    //    the gesture trust chain in modern Chromium-based browsers.
    try {
        const session = await navigator.xr.requestSession('immersive-vr', {
            optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking']
        });

        _currentXRSession = session;

        // Connect the session to Three.js
        await renderer.xr.setSession(session);

        // Update toolbar button to "Exit VR"
        const vrBtn = document.getElementById('enter-vr-btn');
        if (vrBtn) {
            vrBtn.innerHTML = ' Exit VR';
            vrBtn.onclick = () => window.exitVR();
        }

        // When the user exits from the headset side (home button, etc.)
        session.addEventListener('end', () => {
            _currentXRSession = null;
            const btn = document.getElementById('enter-vr-btn');
            if (btn) {
                btn.innerHTML = ' Enter VR';
                btn.onclick = () => window.enterVR();
            }
        });

    } catch (e) {
        console.error('Failed to start VR session:', e);
        alert('Could not start VR session:\n' + (e.message || e));
    }
}

export async function exitVRHeadset() {
    if (_currentXRSession) {
        await _currentXRSession.end().catch(console.warn);
        _currentXRSession = null;
    }
}

export function isVRPresenting() {
    return renderer.xr.isPresenting;
}

// ── Simulated VR (Desktop First-Person Mode) ──
let _simulatedVR = false;
let _savedCamPos = null;
let _savedCamQuat = null;
let _mouseMoveHandler = null;
let _keyDownHandler = null;
let _keyUpHandler = null;
const _keys = {};
const _simVRSpeed = 0.05;
let _yaw = 0;
let _pitch = 0;

export function isSimulatedVR() {
    return _simulatedVR;
}

export function enterSimulatedVR() {
    if (_simulatedVR) return;
    _simulatedVR = true;

    // Save camera state to restore later
    _savedCamPos = camera.position.clone();
    _savedCamQuat = camera.quaternion.clone();

    // Reset to first-person eye level
    camera.position.set(0, 1.6, 3);
    _yaw = 0;
    _pitch = 0;
    camera.rotation.order = 'YXZ';
    camera.rotation.set(0, 0, 0);

    // Disable orbit controls so mouse look takes over
    if (orbitControls) orbitControls.enabled = false;

    // Request pointer lock for mouse-look
    renderer.domElement.requestPointerLock();

    _mouseMoveHandler = (e) => {
        if (!_simulatedVR) return;
        _yaw -= e.movementX * 0.002;
        _pitch -= e.movementY * 0.002;
        _pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, _pitch));
        camera.rotation.set(_pitch, _yaw, 0);
    };
    _keyDownHandler = (e) => { _keys[e.code] = true; };
    _keyUpHandler = (e) => { _keys[e.code] = false; };

    document.addEventListener('mousemove', _mouseMoveHandler);
    document.addEventListener('keydown', _keyDownHandler);
    document.addEventListener('keyup', _keyUpHandler);

    const hint = document.getElementById('vr-sim-hint');
    if (hint) hint.style.display = 'flex';

    const simBtn = document.getElementById('enter-vr-simulated-btn');
    if (simBtn) simBtn.style.display = 'none';
}

export function exitSimulatedVR() {
    if (!_simulatedVR) return;
    _simulatedVR = false;

    if (_savedCamPos) camera.position.copy(_savedCamPos);
    if (_savedCamQuat) camera.quaternion.copy(_savedCamQuat);

    if (orbitControls) orbitControls.enabled = true;
    if (document.pointerLockElement) document.exitPointerLock();

    document.removeEventListener('mousemove', _mouseMoveHandler);
    document.removeEventListener('keydown', _keyDownHandler);
    document.removeEventListener('keyup', _keyUpHandler);

    Object.keys(_keys).forEach(k => delete _keys[k]);

    const hint = document.getElementById('vr-sim-hint');
    if (hint) hint.style.display = 'none';

    const simBtn = document.getElementById('enter-vr-simulated-btn');
    if (simBtn) simBtn.style.display = 'flex';
}

export function tickSimulatedVR() {
    if (!_simulatedVR) return;

    const forward = new THREE.Vector3(-Math.sin(_yaw), 0, -Math.cos(_yaw)).normalize();
    const right = new THREE.Vector3(Math.cos(_yaw), 0, -Math.sin(_yaw)).normalize();

    if (_keys['KeyW'] || _keys['ArrowUp']) camera.position.addScaledVector(forward, _simVRSpeed);
    if (_keys['KeyS'] || _keys['ArrowDown']) camera.position.addScaledVector(forward, -_simVRSpeed);
    if (_keys['KeyA'] || _keys['ArrowLeft']) camera.position.addScaledVector(right, -_simVRSpeed);
    if (_keys['KeyD'] || _keys['ArrowRight']) camera.position.addScaledVector(right, _simVRSpeed);
    if (_keys['Space']) camera.position.y += _simVRSpeed;
    if (_keys['ShiftLeft']) camera.position.y -= _simVRSpeed;
}

// ── Renderer resize ──
export function resizeRenderer() {
    const container = renderer.domElement.parentElement;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if (orbitControls) orbitControls.update();
}

window.addEventListener('resize', resizeRenderer);