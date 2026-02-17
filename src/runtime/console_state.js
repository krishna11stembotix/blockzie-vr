//  blockzie-vr/src/runtime/console_state.js

// Console state
const consoleState = {
    rows: [],
    currentRow: 0,
    currentColumn: 0,
    printColor: 'black',
    printPrecision: null, // null means all digits
    maxRows: 20
};

// Precision mapping
const precisionMap = {
    '1': 0,
    '0.1': 1,
    '0.01': 2,
    '0.001': 3,
    'all': null
};

/**
 * Print text to console
 */
export function printToConsole(value, moveToNextRow = false) {
    // Ensure row exists
    if (!consoleState.rows[consoleState.currentRow]) {
        consoleState.rows[consoleState.currentRow] = {
            text: '',
            color: consoleState.printColor
        };
    }

    // Format value based on precision
    let formattedValue = value;
    if (typeof value === 'number' && consoleState.printPrecision !== null) {
        formattedValue = value.toFixed(consoleState.printPrecision);
    }

    // Append to current row
    consoleState.rows[consoleState.currentRow].text += String(formattedValue);
    consoleState.rows[consoleState.currentRow].color = consoleState.printColor;

    // Move to next row if requested
    if (moveToNextRow) {
        setCursorToNextRow();
    }

    // Update console display
    updateConsoleDisplay();

    console.log(`Console: ${formattedValue}`);
}

/**
 * Move cursor to next row
 */
export function setCursorToNextRow() {
    consoleState.currentRow++;
    consoleState.currentColumn = 0;

    // Limit rows
    if (consoleState.currentRow >= consoleState.maxRows) {
        consoleState.rows.shift();
        consoleState.currentRow = consoleState.maxRows - 1;
    }

    updateConsoleDisplay();
}

/**
 * Clear all console rows
 */
export function clearAllRows() {
    consoleState.rows = [];
    consoleState.currentRow = 0;
    consoleState.currentColumn = 0;
    updateConsoleDisplay();
    console.log('Console cleared');
}

/**
 * Set print precision
 */
export function setPrintPrecision(precision) {
    const precisionValue = precisionMap[precision];
    if (precisionValue !== undefined) {
        consoleState.printPrecision = precisionValue;
        console.log(`Print precision set to ${precision}`);
    }
}

/**
 * Set print color
 */
export function setPrintColor(color) {
    consoleState.printColor = color;
    console.log(`Print color set to ${color}`);
}

/**
 * Update console display in UI
 */
function updateConsoleDisplay() {
    const consoleElement = document.getElementById('console-output');
    if (!consoleElement) return;

    // Clear console
    consoleElement.innerHTML = '';

    // Render each row
    consoleState.rows.forEach(row => {
        if (row && row.text) {
            const rowElement = document.createElement('div');
            rowElement.className = 'console-row';
            rowElement.style.color = row.color;
            rowElement.textContent = row.text;
            consoleElement.appendChild(rowElement);
        }
    });

    // Auto-scroll to bottom
    consoleElement.scrollTop = consoleElement.scrollHeight;
}

/**
 * Get console state (for debugging)
 */
export function getConsoleState() {
    return { ...consoleState };
}
