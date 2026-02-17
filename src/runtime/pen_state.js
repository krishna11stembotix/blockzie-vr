//  blockzie-vr/src/runtime/pen_state.js

// Pen state
const penState = {
    isDown: false,
    width: 2, // Default to "thin"
    color: '#000000', // Default to black
    opacity: 1.0
};

// Width mappings
const widthMap = {
    'extra_thin': 1,
    'thin': 2,
    'medium': 4,
    'wide': 6,
    'extra_wide': 8
};

// Color mappings
const colorMap = {
    'black': '#000000',
    'red': '#ff0000',
    'green': '#00ff00',
    'blue': '#0000ff'
};

/**
 * Set pen down or up
 */
export function setPenState(state) {
    penState.isDown = (state === 'down');
    console.log(`Pen ${state}`);
}

/**
 * Set pen width
 */
export function setPenWidth(width) {
    if (widthMap[width] !== undefined) {
        penState.width = widthMap[width];
        console.log(`Pen width set to ${width} (${penState.width}px)`);
    }
}

/**
 * Set pen color from preset
 */
export function setPenColorPreset(colorName) {
    if (colorMap[colorName] !== undefined) {
        penState.color = colorMap[colorName];
        penState.opacity = 1.0;
        console.log(`Pen color set to ${colorName} (${penState.color})`);
    }
}

/**
 * Set pen color from hex value
 */
export function setPenColorHex(hexColor) {
    penState.color = hexColor;
    penState.opacity = 1.0;
    console.log(`Pen color set to ${hexColor}`);
}

/**
 * Get current pen state
 */
export function getPenState() {
    return { ...penState };
}

/**
 * Check if pen is down
 */
export function isPenDown() {
    return penState.isDown;
}

/**
 * Get current pen color
 */
export function getPenColor() {
    return penState.color;
}

/**
 * Get current pen width
 */
export function getPenWidth() {
    return penState.width;
}
