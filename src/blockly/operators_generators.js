// ========== OPERATORS BLOCK GENERATORS ==========
const javascript = Blockly.JavaScript;

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
