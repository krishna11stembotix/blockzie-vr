// blockzie-vr/src/runtime/events_state.js

const eventListeners = new Map(); // event name -> array of callbacks
const activeEvents = new Set(); // currently broadcasting events

/**
 * Register a listener for an event
 * @param {string} eventName - Name of the event
 * @param {Function} callback - Function to call when event is broadcast
 */
export function onEvent(eventName, callback) {
    if (!eventListeners.has(eventName)) {
        eventListeners.set(eventName, []);
    }
    eventListeners.get(eventName).push(callback);
    console.log(`Registered listener for event: ${eventName}`);
}

/**
 * Broadcast an event (non-blocking)
 * @param {string} eventName - Name of the event to broadcast
 */
export function broadcastEvent(eventName) {
    console.log(`Broadcasting event: ${eventName}`);
    const listeners = eventListeners.get(eventName);

    if (listeners && listeners.length > 0) {
        // Call all listeners asynchronously (non-blocking)
        listeners.forEach(callback => {
            setTimeout(() => callback(), 0);
        });
    }
}

/**
 * Broadcast an event and wait for all listeners to complete
 * @param {string} eventName - Name of the event to broadcast
 * @returns {Promise} Promise that resolves when all listeners complete
 */
export async function broadcastEventAndWait(eventName) {
    console.log(`Broadcasting event and waiting: ${eventName}`);
    const listeners = eventListeners.get(eventName);

    if (listeners && listeners.length > 0) {
        // Call all listeners and wait for them to complete
        const promises = listeners.map(callback => {
            return new Promise(resolve => {
                callback();
                // Give the callback time to execute
                setTimeout(resolve, 100);
            });
        });

        await Promise.all(promises);
    }
}

/**
 * Clear all event listeners (called when project restarts)
 */
export function clearEventListeners() {
    eventListeners.clear();
    activeEvents.clear();
    console.log('Cleared all event listeners');
}

/**
 * Get all registered event names
 * @returns {string[]} Array of event names
 */
export function getEventNames() {
    return Array.from(eventListeners.keys());
}
