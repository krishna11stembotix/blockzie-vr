//  blockzie-vr/src/runtime/executor.js


import {
    moveForward,
    turnRight,
    turnLeft,
    startDriving,
    startTurning,
    stopDriving,
    driveDistance,
    turnAngle,
    turnToHeading,
    turnToRotation
} from '../scene/robot.js';
import { getDriveTimeout } from './drivetrain_state.js';
import {
    setPenState,
    setPenWidth,
    setPenColorPreset,
    setPenColorHex
} from './pen_state.js';
import { fillArea } from '../scene/pen.js';

export const commandQueue = [];
let isRunning = false;

export function stopExecution() {
    isRunning = false;
}

/**
 * Execute a command with optional timeout
 */
async function executeWithTimeout(commandPromise, timeoutSeconds) {
    if (timeoutSeconds <= 0) {
        return await commandPromise;
    }

    return Promise.race([
        commandPromise,
        new Promise((resolve) => setTimeout(() => {
            console.log(`Command timed out after ${timeoutSeconds}s`);
            stopDriving();
            resolve();
        }, timeoutSeconds * 1000))
    ]);
}

/**
 * Execute a single command
 */
async function executeCommand(cmd) {
    const timeout = getDriveTimeout();

    try {
        // Legacy commands
        if (cmd.command === 'move_forward') {
            moveForward();
            await new Promise(r => setTimeout(r, 600));
        }
        else if (cmd.command === 'turn_right') {
            turnRight();
            await new Promise(r => setTimeout(r, 600));
        }
        else if (cmd.command === 'turn_left') {
            turnLeft();
            await new Promise(r => setTimeout(r, 600));
        }
        // Drivetrain: Continuous motion
        else if (cmd.command === 'drive') {
            startDriving(cmd.direction);
            // Continuous motion doesn't wait
        }
        else if (cmd.command === 'turn') {
            startTurning(cmd.direction);
            // Continuous motion doesn't wait
        }
        else if (cmd.command === 'stop_driving') {
            stopDriving();
        }
        // Drivetrain: Distance/Angle-based motion
        else if (cmd.command === 'drive_for') {
            const promise = driveDistance(cmd.direction, cmd.distance, cmd.unit);
            if (cmd.waitForCompletion) {
                await executeWithTimeout(promise, timeout);
            }
            // If not waiting, the promise runs in background
        }
        else if (cmd.command === 'turn_for') {
            const promise = turnAngle(cmd.direction, cmd.angle);
            if (cmd.waitForCompletion) {
                await executeWithTimeout(promise, timeout);
            }
        }
        else if (cmd.command === 'turn_to_heading') {
            const promise = turnToHeading(cmd.heading);
            await executeWithTimeout(promise, timeout);
        }
        else if (cmd.command === 'turn_to_rotation') {
            const promise = turnToRotation(cmd.rotation);
            await executeWithTimeout(promise, timeout);
        }
        // Drawing commands
        else if (cmd.command === 'move_pen') {
            setPenState(cmd.state);
        }
        else if (cmd.command === 'set_pen_to_width') {
            setPenWidth(cmd.width);
        }
        else if (cmd.command === 'set_pen_to_color') {
            setPenColorPreset(cmd.color);
        }
        else if (cmd.command === 'set_pen_color') {
            setPenColorHex(cmd.color);
        }
        else if (cmd.command === 'fill_area') {
            fillArea(cmd.color);
        }
        // Magnet command
        else if (cmd.command === 'energize_magnet') {
            console.log(`Electromagnet: ${cmd.state}`);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        // Control flow commands
        else if (cmd.command === 'wait') {
            await new Promise(resolve => setTimeout(resolve, cmd.time * 1000));
        }
        else if (cmd.command === 'wait_until') {
            // Poll condition every 50ms until it's true
            while (!cmd.condition()) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
        else if (cmd.command === 'forever_start') {
            // Marker for forever loop start (no action needed)
        }
        // Loop commands
        else if (cmd.command === 'repeat') {
            for (let i = 0; i < cmd.times; i++) {
                const startLength = commandQueue.length;
                cmd.body(); // Execute the loop body - adds commands to queue
                // Process all commands added by this iteration
                const addedCommands = commandQueue.splice(startLength);
                for (const addedCmd of addedCommands) {
                    await executeCommand(addedCmd);
                }
                if (!isRunning) break;
            }
        }
        else if (cmd.command === 'forever') {
            // Run forever loop - keep executing until stopped
            while (isRunning) {
                const startLength = commandQueue.length;
                cmd.body(); // Execute the loop body - adds commands to queue
                // Process all commands added by this iteration
                const addedCommands = commandQueue.splice(startLength);
                for (const addedCmd of addedCommands) {
                    await executeCommand(addedCmd);
                }
                await new Promise(resolve => setTimeout(resolve, 10)); // Yield to browser
            }
        }
        else if (cmd.command === 'while') {
            while (cmd.condition() && isRunning) {
                const startLength = commandQueue.length;
                cmd.body(); // Execute the loop body - adds commands to queue
                // Process all commands added by this iteration
                const addedCommands = commandQueue.splice(startLength);
                for (const addedCmd of addedCommands) {
                    await executeCommand(addedCmd);
                }
                await new Promise(resolve => setTimeout(resolve, 10)); // Yield to browser
            }
        }
        else if (cmd.command === 'repeat_until') {
            while (!cmd.condition() && isRunning) {
                const startLength = commandQueue.length;
                cmd.body(); // Execute the loop body - adds commands to queue
                // Process all commands added by this iteration
                const addedCommands = commandQueue.splice(startLength);
                for (const addedCmd of addedCommands) {
                    await executeCommand(addedCmd);
                }
                await new Promise(resolve => setTimeout(resolve, 10)); // Yield to browser
            }
        }
    } catch (error) {
        console.error("Error executing command:", error);
    }
}

export async function runCommands() {
    if (isRunning) return;
    isRunning = true;

    console.log("Starting execution, queue length:", commandQueue.length);

    while (commandQueue.length > 0) {
        const cmd = commandQueue.shift();
        console.log("Executing:", cmd);
        await executeCommand(cmd);
    }

    isRunning = false;
    console.log("Execution finished");
}

console.log("Starting execution, queue length:", commandQueue.length);

while (commandQueue.length > 0) {
    const cmd = commandQueue.shift();
    console.log("Executing:", cmd);

    const timeout = getDriveTimeout();

    try {
        // Legacy commands
        if (cmd.command === 'move_forward') {
            moveForward();
            await new Promise(r => setTimeout(r, 600));
        }
        else if (cmd.command === 'turn_right') {
            turnRight();
            await new Promise(r => setTimeout(r, 600));
        }
        else if (cmd.command === 'turn_left') {
            turnLeft();
            await new Promise(r => setTimeout(r, 600));
        }
        // Drivetrain: Continuous motion
        else if (cmd.command === 'drive') {
            startDriving(cmd.direction);
            // Continuous motion doesn't wait
        }
        else if (cmd.command === 'turn') {
            startTurning(cmd.direction);
            // Continuous motion doesn't wait
        }
        else if (cmd.command === 'stop_driving') {
            stopDriving();
        }
        // Drivetrain: Distance/Angle-based motion
        else if (cmd.command === 'drive_for') {
            const promise = driveDistance(cmd.direction, cmd.distance, cmd.unit);
            if (cmd.waitForCompletion) {
                await executeWithTimeout(promise, timeout);
            }
            // If not waiting, the promise runs in background
        }
        else if (cmd.command === 'turn_for') {
            const promise = turnAngle(cmd.direction, cmd.angle);
            if (cmd.waitForCompletion) {
                await executeWithTimeout(promise, timeout);
            }
        }
        else if (cmd.command === 'turn_to_heading') {
            const promise = turnToHeading(cmd.heading);
            await executeWithTimeout(promise, timeout);
        }
        else if (cmd.command === 'turn_to_rotation') {
            const promise = turnToRotation(cmd.rotation);
            await executeWithTimeout(promise, timeout);
        }
        // Drawing commands
        else if (cmd.command === 'move_pen') {
            setPenState(cmd.state);
        }
        else if (cmd.command === 'set_pen_to_width') {
            setPenWidth(cmd.width);
        }
        else if (cmd.command === 'set_pen_to_color') {
            setPenColorPreset(cmd.color);
        }
        else if (cmd.command === 'set_pen_color') {
            setPenColorHex(cmd.color);
        }
        else if (cmd.command === 'fill_area') {
            fillArea(cmd.color);
        }
        // Magnet command
        else if (cmd.command === 'energize_magnet') {
            console.log(`Electromagnet: ${cmd.state}`);
            // TODO: Implement actual electromagnet behavior when 3D model supports it
            // For now, just log the state change
            await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for visual feedback
        }
        // Control flow commands
        else if (cmd.command === 'wait') {
            await new Promise(resolve => setTimeout(resolve, cmd.time * 1000));
        }
        else if (cmd.command === 'wait_until') {
            // Poll condition every 50ms until it's true
            while (!cmd.condition()) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
        else if (cmd.command === 'forever_start') {
            // Marker for forever loop start (no action needed)
        }
        // Loop commands
        else if (cmd.command === 'repeat') {
            for (let i = 0; i < cmd.times; i++) {
                const startLength = commandQueue.length;
                cmd.body(); // Execute the loop body - adds commands to queue
                // Process all commands added by this iteration
                const addedCommands = commandQueue.splice(startLength);
                for (const addedCmd of addedCommands) {
                    await executeCommand(addedCmd);
                }
                if (!isRunning) break;
            }
        }
        else if (cmd.command === 'forever') {
            // Run forever loop - keep executing until stopped
            while (isRunning) {
                const startLength = commandQueue.length;
                cmd.body(); // Execute the loop body - adds commands to queue
                // Process all commands added by this iteration
                const addedCommands = commandQueue.splice(startLength);
                for (const addedCmd of addedCommands) {
                    await executeCommand(addedCmd);
                }
                await new Promise(resolve => setTimeout(resolve, 10)); // Yield to browser
            }
        }
        else if (cmd.command === 'while') {
            while (cmd.condition() && isRunning) {
                const startLength = commandQueue.length;
                cmd.body(); // Execute the loop body - adds commands to queue
                // Process all commands added by this iteration
                const addedCommands = commandQueue.splice(startLength);
                for (const addedCmd of addedCommands) {
                    await executeCommand(addedCmd);
                }
                await new Promise(resolve => setTimeout(resolve, 10)); // Yield to browser
            }
        }
        else if (cmd.command === 'repeat_until') {
            while (!cmd.condition() && isRunning) {
                const startLength = commandQueue.length;
                cmd.body(); // Execute the loop body - adds commands to queue
                // Process all commands added by this iteration
                const addedCommands = commandQueue.splice(startLength);
                for (const addedCmd of addedCommands) {
                    await executeCommand(addedCmd);
                }
                await new Promise(resolve => setTimeout(resolve, 10)); // Yield to browser
            }
        }
    } catch (error) {
        console.error("Error executing command:", error);
    }
}

isRunning = false;
console.log("Execution finished");

export function addToQueue(cmd) {
    commandQueue.push(cmd);
}

export function clearQueue() {
    commandQueue.length = 0;
}
