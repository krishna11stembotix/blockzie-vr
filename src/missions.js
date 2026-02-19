import * as THREE from 'three';
import { scene } from './scene/scene.js';
import { resetRobot } from './scene/robot.js';
import { stopExecution, clearQueue } from './runtime/executor.js';
import { showVRMissionComplete } from './scene/vr_ui.js';

export let currentMission = null;
export let missionGoal = null;
let missionActive = false;

// ── Scalable missions map ──────────────────────────────────────────────
// Add new missions here. Each entry has:
//   description  - short text shown to the player
//   setup()      - called once when the mission starts
//   check(robot) - called every frame; call showMissionComplete() when done
const missions = {
    1: {
        description: "Reach the Glowing Crystal",
        setup() {
            // Crystal goal (existing logic kept intact)
            const geometry = new THREE.SphereGeometry(0.5, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: 0x00ffff,
                emissive: 0x00ffff,
                emissiveIntensity: 2,
                transparent: true,
                opacity: 0.8
            });
            missionGoal = new THREE.Mesh(geometry, material);
            missionGoal.position.set(0, 0.5, -5);
            const light = new THREE.PointLight(0x00ffff, 1, 5);
            missionGoal.add(light);
            scene.add(missionGoal);
            console.log("Mission 1 goal created at", missionGoal.position);
        },
        check(robot) {
            if (!missionGoal) return;
            if (robot.position.distanceTo(missionGoal.position) < 1) {
                showMissionComplete();
                missionActive = false;
            }
        }
    },

    2: {
        description: "Collect all 3 Glowing Orbs",
        _orbs: [],   // private state for this mission
        setup() {
            this._orbs = [];
            const positions = [
                new THREE.Vector3(-3, 0.5, -4),
                new THREE.Vector3(3, 0.5, -6),
                new THREE.Vector3(0, 0.5, -8)
            ];
            positions.forEach(pos => {
                const mesh = new THREE.Mesh(
                    new THREE.SphereGeometry(0.4, 16, 16),
                    new THREE.MeshStandardMaterial({
                        color: 0xff6600,
                        emissive: 0xff6600,
                        emissiveIntensity: 2,
                        transparent: true,
                        opacity: 0.85
                    })
                );
                mesh.position.copy(pos);
                mesh.add(new THREE.PointLight(0xff6600, 1, 4));
                scene.add(mesh);
                this._orbs.push(mesh);
            });
            console.log("Mission 2: spawned", this._orbs.length, "orbs");
        },
        check(robot) {
            for (let i = this._orbs.length - 1; i >= 0; i--) {
                if (robot.position.distanceTo(this._orbs[i].position) < 1) {
                    scene.remove(this._orbs[i]);
                    this._orbs.splice(i, 1);
                    console.log("Orb collected! Remaining:", this._orbs.length);
                }
            }
            if (this._orbs.length === 0) {
                showMissionComplete();
                missionActive = false;
            }
        }
    }
    // Add Mission 3, … here following the same pattern
};

// ── Helpers ────────────────────────────────────────────────────────────
function updateInstruction(text) {
    const el = document.getElementById('missionInstruction');
    if (el) { el.innerText = text; el.style.display = 'block'; }
}

function showMissionComplete() {
    const overlay = document.getElementById('missionComplete');
    if (overlay) overlay.style.display = 'block';
    showVRMissionComplete();
    console.log("Mission Complete!");
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Starts a mission by id.
 * Resets state, removes previous goal, then delegates to missions[id].setup().
 */
export function startMission(id) {
    if (!missions[id]) { console.warn(`Mission ${id} not found.`); return; }
    console.log(`Initializing Mission ${id}...`);

    currentMission = id;
    missionActive = true;

    stopExecution();
    clearQueue();
    resetRobot();

    if (missionGoal) { scene.remove(missionGoal); missionGoal = null; }

    const completeOverlay = document.getElementById('missionComplete');
    if (completeOverlay) completeOverlay.style.display = 'none';

    updateInstruction(`Goal: ${missions[id].description}`);
    missions[id].setup();
}

/**
 * Call every frame (replaces checkMissionComplete).
 * Delegates win-condition checking to the active mission's check().
 */
export function updateMission(robot) {
    if (!missionActive || !robot || !missions[currentMission]) return;
    missions[currentMission].check(robot);
}

// ── Legacy alias so existing callers (main.js) keep working ───────────
export { updateMission as checkMissionComplete };

// ── Window bridge (optional) ───────────────────────────────────────────
if (window.missionLogic) {
    window.missionLogic.startMission = startMission;
}

// Keep createMissionGoal exported for backward-compatibility
export function createMissionGoal() {
    missions[1].setup();
}
