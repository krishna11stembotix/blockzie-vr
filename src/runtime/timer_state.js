// blockzie-vr/src/runtime/timer_state.js

let timerStartTime = Date.now();
const timerEventListeners = [];

/**
 * Reset the timer to zero
 */
export function resetTimer() {
    timerStartTime = Date.now();
    console.log('Timer reset');
}

/**
 * Get the elapsed time in seconds since timer was last reset
 * @returns {number} Elapsed time in seconds
 */
export function getTimerSeconds() {
    const elapsed = (Date.now() - timerStartTime) / 1000;
    return elapsed;
}

/**
 * Register a timer event listener
 * @param {number} seconds - Time threshold in seconds
 * @param {Function} callback - Function to call when timer exceeds threshold
 * @returns {number} Listener ID
 */
export function onTimerEvent(seconds, callback) {
    const listener = {
        id: Date.now() + Math.random(),
        seconds,
        callback,
        triggered: false
    };
    timerEventListeners.push(listener);
    return listener.id;
}

/**
 * Check timer events and trigger callbacks
 * Should be called periodically (e.g., in animation loop)
 */
export function checkTimerEvents() {
    const currentTime = getTimerSeconds();

    timerEventListeners.forEach(listener => {
        if (!listener.triggered && currentTime > listener.seconds) {
            listener.triggered = true;
            listener.callback();
        }
    });
}

/**
 * Reset all timer event listeners (called when project restarts)
 */
export function resetTimerEvents() {
    timerEventListeners.length = 0;
}

/**
 * Initialize timer (called at project start)
 */
export function initTimer() {
    resetTimer();
    resetTimerEvents();
}
