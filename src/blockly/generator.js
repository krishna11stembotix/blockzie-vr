//  blockzie-vr/src/blockly/generator.js


const javascript = Blockly.JavaScript;
console.log("Loading generator.js");

javascript.forBlock["when_run"] = function (block) {
    return "// Start execution\n";
};

javascript.forBlock["move_forward"] = function (block) {
    return "addToQueue({ command: 'move_forward' });\n";
};

javascript.forBlock["turn_right"] = function (block) {
    return "addToQueue({ command: 'turn_right' });\n";
};

javascript.forBlock["turn_left"] = function (block) {
    return "addToQueue({ command: 'turn_left' });\n";
};

// ========== DRIVETRAIN BLOCK GENERATORS ==========
// ACTION BLOCKS
javascript.forBlock["drive"] = function (block) {
    const direction = block.getFieldValue('DIRECTION');
    return `addToQueue({ command: 'drive', direction: '${direction}' });\n`;
};

javascript.forBlock["drive_for"] = function (block) {
    const direction = block.getFieldValue('DIRECTION');
    const distance = block.getFieldValue('DISTANCE');
    const unit = block.getFieldValue('UNIT');
    return `addToQueue({ command: 'drive_for', direction: '${direction}', distance: ${distance}, unit: '${unit}', waitForCompletion: true });\n`;
};

javascript.forBlock["turn"] = function (block) {
    const direction = block.getFieldValue('DIRECTION');
    return `addToQueue({ command: 'turn', direction: '${direction}' });\n`;
};

javascript.forBlock["turn_for"] = function (block) {
    const direction = block.getFieldValue('DIRECTION');
    const angle = block.getFieldValue('ANGLE');
    return `addToQueue({ command: 'turn_for', direction: '${direction}', angle: ${angle}, waitForCompletion: true });\n`;
};

javascript.forBlock["turn_to_heading"] = function (block) {
    const heading = block.getFieldValue('HEADING');
    return `addToQueue({ command: 'turn_to_heading', heading: ${heading} });\n`;
};

javascript.forBlock["turn_to_rotation"] = function (block) {
    const rotation = block.getFieldValue('HEADING');
    return `addToQueue({ command: 'turn_to_rotation', rotation: ${rotation} });\n`;
};

javascript.forBlock["stop_driving"] = function (block) {
    return "addToQueue({ command: 'stop_driving' });\n";
};

// SETTINGS BLOCKS
javascript.forBlock["set_drive_velocity"] = function (block) {
    const velocity = block.getFieldValue('VELOCITY');
    return `setDriveVelocity(${velocity});\n`;
};

javascript.forBlock["set_turn_velocity"] = function (block) {
    const velocity = block.getFieldValue('VELOCITY');
    return `setTurnVelocity(${velocity});\n`;
};

javascript.forBlock["set_drive_heading"] = function (block) {
    const heading = block.getFieldValue('HEADING');
    return `setDriveHeading(${heading});\n`;
};

javascript.forBlock["set_drive_rotation"] = function (block) {
    const rotation = block.getFieldValue('ROTATION');
    return `setDriveRotation(${rotation});\n`;
};

javascript.forBlock["set_drive_timeout"] = function (block) {
    const timeout = block.getFieldValue('TIMEOUT');
    return `setDriveTimeout(${timeout});\n`;
};

// VALUE BLOCKS
javascript.forBlock["drive_is_done"] = function (block) {
    return ['isDriveDone()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

javascript.forBlock["drive_is_moving"] = function (block) {
    return ['isDriveMoving()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

javascript.forBlock["drive_heading"] = function (block) {
    return ['getDriveHeading()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

javascript.forBlock["drive_rotation"] = function (block) {
    return ['getDriveRotation()', Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

// ========== MAGNET BLOCK GENERATORS ==========
javascript.forBlock["energize_magnet"] = function (block) {
    const state = block.getFieldValue('STATE');
    return `addToQueue({ command: 'energize_magnet', state: '${state}' });\n`;
};

// ========== DRAWING BLOCK GENERATORS ==========
javascript.forBlock["move_pen"] = function (block) {
    const state = block.getFieldValue('STATE');
    return `addToQueue({ command: 'move_pen', state: '${state}' });\n`;
};

javascript.forBlock["set_pen_to_width"] = function (block) {
    const width = block.getFieldValue('WIDTH');
    return `addToQueue({ command: 'set_pen_to_width', width: '${width}' });\n`;
};

javascript.forBlock["set_pen_to_color"] = function (block) {
    const color = block.getFieldValue('COLOR');
    return `addToQueue({ command: 'set_pen_to_color', color: '${color}' });\n`;
};

javascript.forBlock["set_pen_color"] = function (block) {
    const color = block.getFieldValue('COLOR');
    return `addToQueue({ command: 'set_pen_color', color: '${color}' });\n`;
};

javascript.forBlock["fill_area"] = function (block) {
    const color = block.getFieldValue('COLOR');
    return `addToQueue({ command: 'fill_area', color: '${color}' });\n`;
};

// ========== SENSING BLOCK GENERATORS - BUMPER ==========
javascript.forBlock["bumper_pressed"] = function (block) {
    const bumper = block.getFieldValue('BUMPER');
    return [`isBumperPressed('${bumper}')`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

javascript.forBlock["when_bumper"] = function (block) {
    const bumper = block.getFieldValue('BUMPER');
    const state = block.getFieldValue('STATE');
    // Hat blocks are handled differently - register event listener
    return `onBumperEvent('${bumper}', '${state}', function() {\n`;
};

// ========== SENSING BLOCK GENERATORS - DISTANCE ==========
javascript.forBlock["distance_found_object"] = function (block) {
    const sensor = block.getFieldValue('SENSOR');
    return [`distanceFoundObject('${sensor}')`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

javascript.forBlock["object_distance"] = function (block) {
    const sensor = block.getFieldValue('SENSOR');
    const unit = block.getFieldValue('UNIT');
    return [`getObjectDistance('${sensor}', '${unit}')`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

// ========== SENSING BLOCK GENERATORS - EYE ==========
javascript.forBlock["eye_near_object"] = function (block) {
    const eye = block.getFieldValue('EYE');
    return [`eyeNearObject('${eye}')`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

javascript.forBlock["eye_detects_color"] = function (block) {
    const eye = block.getFieldValue('EYE');
    const color = block.getFieldValue('COLOR');
    return [`eyeDetectsColor('${eye}', '${color}')`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

javascript.forBlock["eye_brightness"] = function (block) {
    const eye = block.getFieldValue('EYE');
    return [`getEyeBrightness('${eye}')`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

javascript.forBlock["when_eye"] = function (block) {
    const eye = block.getFieldValue('EYE');
    const state = block.getFieldValue('STATE');
    // Hat blocks are handled differently - register event listener
    return `onEyeEvent('${eye}', '${state}', function() {\n`;
};

// ========== SENSING BLOCK GENERATORS - LOCATION ==========
javascript.forBlock["position"] = function (block) {
    const axis = block.getFieldValue('AXIS');
    const unit = block.getFieldValue('UNIT');
    return [`getPosition('${axis}', '${unit}')`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

javascript.forBlock["position_angle"] = function (block) {
    return [`getDriveHeading()`, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

// ========== CONSOLE BLOCK GENERATORS ==========
javascript.forBlock["print"] = function (block) {
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    // Always move to next row after printing
    return `printToConsole(${value}, true);\n`;
};

javascript.forBlock["set_cursor_to_next_row"] = function (block) {
    return `setCursorToNextRow();\n`;
};

javascript.forBlock["clear_all_rows"] = function (block) {
    return `clearAllRows();\n`;
};

javascript.forBlock["set_print_precision"] = function (block) {
    const precision = block.getFieldValue('PRECISION');
    return `setPrintPrecision('${precision}');\n`;
};

javascript.forBlock["set_print_color"] = function (block) {
    const color = block.getFieldValue('COLOR');
    return `setPrintColor('${color}');\n`;
};

// ========== CONTROL BLOCK GENERATORS ==========
javascript.forBlock["wait"] = function (block) {
    const time = block.getFieldValue('TIME');
    return `addToQueue({ command: 'wait', time: ${time}, waitForCompletion: true });\n`;
};

javascript.forBlock["wait_until"] = function (block) {
    const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_NONE) || 'false';
    return `addToQueue({ command: 'wait_until', condition: () => ${condition}, waitForCompletion: true });\n`;
};

javascript.forBlock["repeat"] = function (block) {
    const times = block.getFieldValue('TIMES');
    const branch = Blockly.JavaScript.statementToCode(block, 'DO');
    // Generate the loop body code as a function
    const loopBody = `function() {\n${branch}}\n`;
    return `addToQueue({ command: 'repeat', times: ${times}, body: ${loopBody}, waitForCompletion: true });\n`;
};

javascript.forBlock["forever"] = function (block) {
    const branch = Blockly.JavaScript.statementToCode(block, 'DO');
    // Generate the loop body code as a function
    const loopBody = `function() {\n${branch}}\n`;
    return `addToQueue({ command: 'forever', body: ${loopBody}, waitForCompletion: true });\n`;
};

javascript.forBlock["repeat_until"] = function (block) {
    const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_NONE) || 'false';
    const branch = Blockly.JavaScript.statementToCode(block, 'DO');
    const loopBody = `function() {\n${branch}}\n`;
    return `addToQueue({ command: 'repeat_until', condition: () => ${condition}, body: ${loopBody}, waitForCompletion: true });\n`;
};

javascript.forBlock["while"] = function (block) {
    const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_NONE) || 'false';
    const branch = Blockly.JavaScript.statementToCode(block, 'DO');
    const loopBody = `function() {\n${branch}}\n`;
    return `addToQueue({ command: 'while', condition: () => ${condition}, body: ${loopBody}, waitForCompletion: true });\n`;
};

javascript.forBlock["controls_if"] = function (block) {
    const conditionCode = Blockly.JavaScript.valueToCode(block, 'IF0', Blockly.JavaScript.ORDER_NONE) || 'false';
    const branchCode = Blockly.JavaScript.statementToCode(block, 'DO0');
    return `if (${conditionCode}) {\n${branchCode}}\n`;
};

javascript.forBlock["controls_if_else"] = function (block) {
    const conditionCode = Blockly.JavaScript.valueToCode(block, 'IF0', Blockly.JavaScript.ORDER_NONE) || 'false';
    const branchCode = Blockly.JavaScript.statementToCode(block, 'DO0');
    const elseBranchCode = Blockly.JavaScript.statementToCode(block, 'ELSE');
    return `if (${conditionCode}) {\n${branchCode}} else {\n${elseBranchCode}}\n`;
};

javascript.forBlock["break"] = function (block) {
    return `break;\n`;
};

javascript.forBlock["stop_project"] = function (block) {
    return `throw new Error('Project stopped');\n`;
};

// ========== TIMER BLOCK GENERATORS ==========
javascript.forBlock["reset_timer"] = function (block) {
    return `resetTimer();\n`;
};

javascript.forBlock["timer_in_seconds"] = function (block) {
    const code = 'getTimerSeconds()';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

javascript.forBlock["when_timer"] = function (block) {
    const time = block.getFieldValue('TIME');
    // Get all the code that follows this block
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    let branch = '';
    if (nextBlock) {
        branch = Blockly.JavaScript.blockToCode(nextBlock);
    }
    // Register timer event listener with the code to execute
    return `onTimerEvent(${time}, async function() {\n${branch}});\n`;
};

// ========== EVENTS BLOCK GENERATORS ==========
javascript.forBlock["when_i_receive"] = function (block) {
    const eventName = block.getFieldValue('EVENT');
    // Get all the code that follows this block
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    let branch = '';
    if (nextBlock) {
        branch = Blockly.JavaScript.blockToCode(nextBlock);
    }
    // Register event listener with the code to execute
    return `onEvent('${eventName}', async function() {\n${branch}});\n`;
};

javascript.forBlock["broadcast"] = function (block) {
    const eventName = block.getFieldValue('EVENT');
    return `broadcastEvent('${eventName}');\n`;
};

javascript.forBlock["broadcast_and_wait"] = function (block) {
    const eventName = block.getFieldValue('EVENT');
    return `addToQueue({ command: 'broadcast_and_wait', event: '${eventName}', waitForCompletion: true });\n`;
};

// ========== OPERATORS BLOCK GENERATORS ==========

// Number block
javascript.forBlock["math_number"] = function (block) {
    const num = block.getFieldValue('NUM');
    return [num, Blockly.JavaScript.ORDER_ATOMIC];
};

// Text block
javascript.forBlock["text"] = function (block) {
    const text = block.getFieldValue('TEXT');
    return [`"${text}"`, Blockly.JavaScript.ORDER_ATOMIC];
};

// Math operator
javascript.forBlock["math_operator"] = function (block) {
    const op = block.getFieldValue('OP');
    const a = Blockly.JavaScript.valueToCode(block, 'A', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const b = Blockly.JavaScript.valueToCode(block, 'B', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const operators = { ADD: '+', SUBTRACT: '-', MULTIPLY: '*', DIVIDE: '/' };
    const code = `(${a} ${operators[op]} ${b})`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

// Comparison operator
javascript.forBlock["comparison_operator"] = function (block) {
    const op = block.getFieldValue('OP');
    const a = Blockly.JavaScript.valueToCode(block, 'A', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const b = Blockly.JavaScript.valueToCode(block, 'B', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const operators = { EQ: '===', LT: '<', LTE: '<=', GT: '>', GTE: '>=' };
    const code = `(${a} ${operators[op]} ${b})`;
    return [code, Blockly.JavaScript.ORDER_RELATIONAL];
};

// Logical operator
javascript.forBlock["logical_operator"] = function (block) {
    const op = block.getFieldValue('OP');
    const a = Blockly.JavaScript.valueToCode(block, 'A', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
    const b = Blockly.JavaScript.valueToCode(block, 'B', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
    const operators = { AND: '&&', OR: '||' };
    const code = `(${a} ${operators[op]} ${b})`;
    return [code, Blockly.JavaScript.ORDER_LOGICAL_AND];
};

// Not operator
javascript.forBlock["not_operator"] = function (block) {
    const bool = Blockly.JavaScript.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
    const code = `(!${bool})`;
    return [code, Blockly.JavaScript.ORDER_LOGICAL_NOT];
};

// Range operator
javascript.forBlock["range_operator"] = function (block) {
    const low = Blockly.JavaScript.valueToCode(block, 'LOW', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const high = Blockly.JavaScript.valueToCode(block, 'HIGH', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const lowOp = block.getFieldValue('LOWOP') === 'LT' ? '<' : '<=';
    const highOp = block.getFieldValue('HIGHOP') === 'LT' ? '<' : '<=';
    const code = `(${low} ${lowOp} ${value} && ${value} ${highOp} ${high})`;
    return [code, Blockly.JavaScript.ORDER_LOGICAL_AND];
};

// Pick random
javascript.forBlock["pick_random"] = function (block) {
    const min = block.getFieldValue('MIN');
    const max = block.getFieldValue('MAX');
    const code = `Math.floor(Math.random() * (${max} - ${min} + 1)) + ${min}`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

// Round number
javascript.forBlock["round_number"] = function (block) {
    const num = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const denom = Blockly.JavaScript.valueToCode(block, 'DENOM', Blockly.JavaScript.ORDER_ATOMIC) || '1';
    const places = block.getFieldValue('PLACES');
    const multiplier = Math.pow(10, places);
    const code = `(Math.round((${num} / ${denom}) * ${multiplier}) / ${multiplier})`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

// Math functions
javascript.forBlock["math_functions"] = function (block) {
    const func = block.getFieldValue('FUNC');
    const num = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_ATOMIC) || '0';

    const functions = {
        ABS: `Math.abs(${num})`,
        FLOOR: `Math.floor(${num})`,
        CEIL: `Math.ceil(${num})`,
        SQRT: `Math.sqrt(${num})`,
        SIN: `Math.sin(${num} * Math.PI / 180)`,
        COS: `Math.cos(${num} * Math.PI / 180)`,
        TAN: `Math.tan(${num} * Math.PI / 180)`,
        ASIN: `(Math.asin(${num}) * 180 / Math.PI)`,
        ACOS: `(Math.acos(${num}) * 180 / Math.PI)`,
        ATAN: `(Math.atan(${num}) * 180 / Math.PI)`,
        LN: `Math.log(${num})`,
        LOG10: `Math.log10(${num})`,
        EXP: `Math.exp(${num})`,
        POW10: `Math.pow(10, ${num})`,
        NEG: `(-(${num}))`
    };

    const code = functions[func];
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

// atan2
javascript.forBlock["atan2"] = function (block) {
    const x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const y = Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const code = `(Math.atan2(${y}, ${x}) * 180 / Math.PI)`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

// Remainder
javascript.forBlock["remainder"] = function (block) {
    const dividend = Blockly.JavaScript.valueToCode(block, 'DIVIDEND', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const divisor = Blockly.JavaScript.valueToCode(block, 'DIVISOR', Blockly.JavaScript.ORDER_ATOMIC) || '1';
    const code = `(${dividend} % ${divisor})`;
    return [code, Blockly.JavaScript.ORDER_MODULUS];
};

// Join
javascript.forBlock["join"] = function (block) {
    const a = Blockly.JavaScript.valueToCode(block, 'A', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const b = Blockly.JavaScript.valueToCode(block, 'B', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const code = `(String(${a}) + String(${b}))`;
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};

// Letter
javascript.forBlock["letter"] = function (block) {
    const pos = block.getFieldValue('POS');
    const string = Blockly.JavaScript.valueToCode(block, 'STRING', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const code = `String(${string}).charAt(${pos} - 1)`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

// Length
javascript.forBlock["length"] = function (block) {
    const string = Blockly.JavaScript.valueToCode(block, 'STRING', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const code = `String(${string}).length`;
    return [code, Blockly.JavaScript.ORDER_MEMBER];
};

// Contains
javascript.forBlock["contains"] = function (block) {
    const string = Blockly.JavaScript.valueToCode(block, 'STRING', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const search = Blockly.JavaScript.valueToCode(block, 'SEARCH', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const code = `String(${string}).includes(String(${search}))`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

// Convert
javascript.forBlock["convert"] = function (block) {
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const type = block.getFieldValue('TYPE');

    if (type === 'TEXT') {
        const code = `String(${value})`;
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    } else {
        const code = `Number(${value})`;
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    }
};

// ========== COMMENT BLOCK GENERATOR ==========
javascript.forBlock["comment"] = function (block) {
    // Comments don't generate any code
    return '';
};
