//  blockzie-vr/src/blockly/blocks.js

// Define blocks
Blockly.defineBlocksWithJsonArray([
  {
    "type": "when_run",
    "message0": "when run",
    "nextStatement": null,
    "colour": 65,
    "hat": true
  },
  {
    "type": "move_forward",
    "message0": "move forward",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160
  },
  {
    "type": "turn_right",
    "message0": "turn right",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210
  },
  {
    "type": "turn_left",
    "message0": "turn left",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210
  },
  // ========== DRIVETRAIN BLOCKS ==========
  // ACTION BLOCKS
  {
    "type": "drive",
    "message0": "drive %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIRECTION",
        "options": [
          ["forward", "forward"],
          ["reverse", "reverse"]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#4C97FF",
    "tooltip": "Continuously drive forward or reverse until stopped"
  },
  {
    "type": "drive_for",
    "message0": "drive %1 for %2 %3 %4",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIRECTION",
        "options": [
          ["forward", "forward"],
          ["reverse", "reverse"]
        ]
      },
      {
        "type": "field_number",
        "name": "DISTANCE",
        "value": 200
      },
      {
        "type": "field_dropdown",
        "name": "UNIT",
        "options": [
          ["mm", "mm"],
          ["inches", "inches"]
        ]
      },
      {
        "type": "field_label",
        "text": "▶"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#4C97FF",
    "tooltip": "Drive a specific distance"
  },
  {
    "type": "turn",
    "message0": "turn %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIRECTION",
        "options": [
          ["left", "left"],
          ["right", "right"]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#4C97FF",
    "tooltip": "Continuously turn left or right until stopped"
  },
  {
    "type": "turn_for",
    "message0": "turn %1 for %2 degrees %3",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIRECTION",
        "options": [
          ["left", "left"],
          ["right", "right"]
        ]
      },
      {
        "type": "field_number",
        "name": "ANGLE",
        "value": 90
      },
      {
        "type": "field_label",
        "text": "▶"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#4C97FF",
    "tooltip": "Turn a specific number of degrees"
  },
  {
    "type": "turn_to_heading",
    "message0": "turn to heading %1 degrees %2",
    "args0": [
      {
        "type": "field_number",
        "name": "HEADING",
        "value": 90
      },
      {
        "type": "field_label",
        "text": "▶"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#4C97FF",
    "tooltip": "Turn to face an absolute heading (0-360°)"
  },
  {
    "type": "turn_to_rotation",
    "message0": "turn to rotation %1 degrees",
    "args0": [
      {
        "type": "field_number",
        "name": "HEADING",
        "value": 90
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#4C97FF",
    "tooltip": "Turn to reach a cumulative rotation value"
  },
  {
    "type": "stop_driving",
    "message0": "stop driving",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#4C97FF",
    "tooltip": "Stop all drivetrain motion"
  },
  // SETTINGS BLOCKS
  {
    "type": "set_drive_velocity",
    "message0": "set drive velocity to %1 %2",
    "args0": [
      {
        "type": "field_number",
        "name": "VELOCITY",
        "value": 50,
        "min": 0,
        "max": 100
      },
      {
        "type": "field_dropdown",
        "name": "UNIT",
        "options": [["% ▼", "%"]]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#4C97FF",
    "tooltip": "Set drive speed (0-100%)"
  },
  {
    "type": "set_turn_velocity",
    "message0": "set turn velocity to %1 %2",
    "args0": [
      {
        "type": "field_number",
        "name": "VELOCITY",
        "value": 50,
        "min": 0,
        "max": 100
      },
      {
        "type": "field_dropdown",
        "name": "UNIT",
        "options": [["% ▼", "%"]]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#4C97FF",
    "tooltip": "Set turn speed (0-100%)"
  },
  {
    "type": "set_drive_heading",
    "message0": "set drive heading to %1 degrees",
    "args0": [
      {
        "type": "field_number",
        "name": "HEADING",
        "value": 0
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#4C97FF",
    "tooltip": "Override the current heading value"
  },
  {
    "type": "set_drive_rotation",
    "message0": "set drive rotation to %1 degrees",
    "args0": [
      {
        "type": "field_number",
        "name": "ROTATION",
        "value": 0
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#4C97FF",
    "tooltip": "Override the cumulative rotation value"
  },
  {
    "type": "set_drive_timeout",
    "message0": "set drive timeout to %1 seconds",
    "args0": [
      {
        "type": "field_number",
        "name": "TIMEOUT",
        "value": 1
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#4C97FF",
    "tooltip": "Set timeout for movement commands (0 = no timeout)"
  },
  // VALUE BLOCKS
  {
    "type": "drive_is_done",
    "message0": "drive is done?",
    "output": "Boolean",
    "colour": "#4C97FF",
    "tooltip": "Returns true if drivetrain is not moving"
  },
  {
    "type": "drive_is_moving",
    "message0": "drive is moving?",
    "output": "Boolean",
    "colour": "#4C97FF",
    "tooltip": "Returns true if robot is currently moving"
  },
  {
    "type": "drive_heading",
    "message0": "drive heading in degrees",
    "output": "Number",
    "colour": "#4C97FF",
    "tooltip": "Returns current heading in degrees (0-359.99°)"
  },
  {
    "type": "drive_rotation",
    "message0": "drive rotation in degrees",
    "output": "Number",
    "colour": "#4C97FF",
    "tooltip": "Returns cumulative rotation since start"
  },
  // ========== MAGNET BLOCKS ==========
  {
    "type": "energize_magnet",
    "message0": "energize %1 to %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DEVICE",
        "options": [
          ["Magnet", "magnet"]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "STATE",
        "options": [
          ["boost", "boost"],
          ["drop", "drop"]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#A589CF",
    "tooltip": "Set electromagnet state: boost to pick up objects, drop to release them"
  },
  // ========== DRAWING BLOCKS ==========
  {
    "type": "move_pen",
    "message0": "move pen %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "STATE",
        "options": [
          ["down", "down"],
          ["up", "up"]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#C77EB5",
    "tooltip": "Raise or lower the robot's pen to start or stop drawing"
  },
  {
    "type": "set_pen_to_width",
    "message0": "set pen to width %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "WIDTH",
        "options": [
          ["extra thin", "extra_thin"],
          ["thin", "thin"],
          ["medium", "medium"],
          ["wide", "wide"],
          ["extra wide", "extra_wide"]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#C77EB5",
    "tooltip": "Set the width of the robot's pen"
  },
  {
    "type": "set_pen_to_color",
    "message0": "set pen to color %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "COLOR",
        "options": [
          ["black", "black"],
          ["red", "red"],
          ["green", "green"],
          ["blue", "blue"]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#C77EB5",
    "tooltip": "Set the color of the robot's pen from a preset list"
  },
  {
    "type": "set_pen_color",
    "message0": "set pen color %1",
    "args0": [
      {
        "type": "field_colour",
        "name": "COLOR",
        "colour": "#ff0000"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#C77EB5",
    "tooltip": "Set the color of the robot's pen with a color picker"
  },
  {
    "type": "fill_area",
    "message0": "fill area with color %1",
    "args0": [
      {
        "type": "field_colour",
        "name": "COLOR",
        "colour": "#0000ff"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#C77EB5",
    "tooltip": "Fill an enclosed area with a specified color"
  },
  // ========== SENSING BLOCKS - BUMPER ==========
  {
    "type": "bumper_pressed",
    "message0": "%1 pressed?",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "BUMPER",
        "options": [
          ["LeftBumper", "left"],
          ["RightBumper", "right"]
        ]
      }
    ],
    "output": "Boolean",
    "colour": "#5CB1A6",
    "tooltip": "Returns true if the bumper is currently pressed"
  },
  {
    "type": "when_bumper",
    "message0": "when %1 %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "BUMPER",
        "options": [
          ["LeftBumper", "left"],
          ["RightBumper", "right"]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "STATE",
        "options": [
          ["pressed", "pressed"],
          ["released", "released"]
        ]
      }
    ],
    "nextStatement": null,
    "colour": "#FFD500",
    "hat": true,
    "tooltip": "Runs when the bumper is pressed or released"
  },
  // ========== SENSING BLOCKS - DISTANCE ==========
  {
    "type": "distance_found_object",
    "message0": "%1 found an object?",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "SENSOR",
        "options": [
          ["FrontDistance", "front"]
        ]
      }
    ],
    "output": "Boolean",
    "colour": "#5CB1A6",
    "tooltip": "Returns true if the distance sensor detects an object within 2000mm"
  },
  {
    "type": "object_distance",
    "message0": "%1 distance in %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "SENSOR",
        "options": [
          ["FrontDistance", "front"]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "UNIT",
        "options": [
          ["mm", "mm"],
          ["inches", "inches"]
        ]
      }
    ],
    "output": "Number",
    "colour": "#5CB1A6",
    "tooltip": "Returns the distance to the nearest object"
  },
  // ========== SENSING BLOCKS - EYE ==========
  {
    "type": "eye_near_object",
    "message0": "%1 is near object?",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "EYE",
        "options": [
          ["FrontEye", "front"]
        ]
      }
    ],
    "output": "Boolean",
    "colour": "#5CB1A6",
    "tooltip": "Returns true if the eye sensor detects an object within range"
  },
  {
    "type": "eye_detects_color",
    "message0": "%1 detects %2 ?",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "EYE",
        "options": [
          ["FrontEye", "front"]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "COLOR",
        "options": [
          ["red", "red"],
          ["green", "green"],
          ["blue", "blue"]
        ]
      }
    ],
    "output": "Boolean",
    "colour": "#5CB1A6",
    "tooltip": "Returns true if the eye sensor detects the specified color"
  },
  {
    "type": "eye_brightness",
    "message0": "%1 brightness in %",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "EYE",
        "options": [
          ["FrontEye", "front"]
        ]
      }
    ],
    "output": "Number",
    "colour": "#5CB1A6",
    "tooltip": "Returns the brightness detected by the eye sensor (0-100%)"
  },
  {
    "type": "when_eye",
    "message0": "when %1 %2 an object",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "EYE",
        "options": [
          ["FrontEye", "front"]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "STATE",
        "options": [
          ["detects", "detects"],
          ["loses", "loses"]
        ]
      }
    ],
    "nextStatement": null,
    "colour": "#FFD500",
    "hat": true,
    "tooltip": "Runs when the eye sensor detects or loses an object"
  },
  // ========== SENSING BLOCKS - LOCATION ==========
  {
    "type": "position",
    "message0": "position %1 in %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "AXIS",
        "options": [
          ["X", "x"],
          ["Y", "y"]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "UNIT",
        "options": [
          ["mm", "mm"],
          ["inches", "inches"]
        ]
      }
    ],
    "output": "Number",
    "colour": "#5CB1A6",
    "tooltip": "Returns the robot's X or Y position"
  },
  {
    "type": "position_angle",
    "message0": "position angle in degrees",
    "output": "Number",
    "colour": "#5CB1A6",
    "tooltip": "Returns the robot's angle in degrees"
  },
  // ========== CONSOLE BLOCKS ==========
  {
    "type": "print",
    "message0": "print %1 ▶",
    "args0": [
      {
        "type": "input_value",
        "name": "VALUE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#A5D6A7",
    "tooltip": "Print text or value to the console"
  },
  {
    "type": "set_cursor_to_next_row",
    "message0": "set cursor to next row",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#A5D6A7",
    "tooltip": "Move the cursor to the next row in the console"
  },
  {
    "type": "clear_all_rows",
    "message0": "clear all rows",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#A5D6A7",
    "tooltip": "Clear all text from the console"
  },
  {
    "type": "set_print_precision",
    "message0": "set print precision to %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "PRECISION",
        "options": [
          ["1", "1"],
          ["0.1", "0.1"],
          ["0.01", "0.01"],
          ["0.001", "0.001"],
          ["All Digits", "all"]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#A5D6A7",
    "tooltip": "Set the number of decimal places to display"
  },
  {
    "type": "set_print_color",
    "message0": "set print color %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "COLOR",
        "options": [
          ["black", "black"],
          ["red", "red"],
          ["green", "green"],
          ["blue", "blue"]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#A5D6A7",
    "tooltip": "Set the color for console text"
  }
]);

// ========== CONTROL BLOCKS ==========
Blockly.defineBlocksWithJsonArray([
  {
    "type": "wait",
    "message0": "wait %1 seconds",
    "args0": [
      {
        "type": "field_number",
        "name": "TIME",
        "value": 1,
        "min": 0
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Pause execution for a specific duration"
  },
  {
    "type": "wait_until",
    "message0": "wait until %1",
    "args0": [
      {
        "type": "input_value",
        "name": "CONDITION",
        "check": "Boolean"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Pause until a condition is met"
  },
  {
    "type": "repeat",
    "message0": "repeat %1",
    "args0": [
      {
        "type": "field_number",
        "name": "TIMES",
        "value": 10,
        "min": 0
      }
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Repeat blocks a specific number of times"
  },
  {
    "type": "forever",
    "message0": "forever",
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "previousStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Repeat blocks indefinitely"
  },
  {
    "type": "repeat_until",
    "message0": "repeat until %1",
    "args0": [
      {
        "type": "input_value",
        "name": "CONDITION",
        "check": "Boolean"
      }
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Repeat until a condition is met"
  },
  {
    "type": "while",
    "message0": "while %1",
    "args0": [
      {
        "type": "input_value",
        "name": "CONDITION",
        "check": "Boolean"
      }
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Repeat while a condition is true"
  },
  {
    "type": "controls_if",
    "message0": "if %1",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "Boolean"
      }
    ],
    "message1": "then %1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Run blocks if a condition is true"
  },
  {
    "type": "controls_if_else",
    "message0": "if %1",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "Boolean"
      }
    ],
    "message1": "then %1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0"
      }
    ],
    "message2": "else %1",
    "args2": [
      {
        "type": "input_statement",
        "name": "ELSE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Run one set of blocks if true, another if false"
  },
  {
    "type": "break",
    "message0": "break",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Exit a loop immediately"
  },
  {
    "type": "stop_project",
    "message0": "stop project",
    "previousStatement": null,
    "colour": "#FFAB19",
    "tooltip": "End the execution of the project"
  }
]);

// ========== TIMER BLOCKS ==========
Blockly.defineBlocksWithJsonArray([
  {
    "type": "reset_timer",
    "message0": "reset timer",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#4C97FF",
    "tooltip": "Reset the timer to zero"
  },
  {
    "type": "timer_in_seconds",
    "message0": "timer in seconds",
    "output": "Number",
    "colour": "#4C97FF",
    "tooltip": "Get elapsed time in seconds since timer was reset"
  },
  {
    "type": "when_timer",
    "message0": "when timer > %1 seconds",
    "args0": [
      {
        "type": "field_number",
        "name": "TIME",
        "value": 1,
        "min": 0
      }
    ],
    "nextStatement": null,
    "colour": "#FFD500",
    "tooltip": "Run blocks when timer exceeds specified time",
    "hat": true
  }
]);

// ========== EVENTS BLOCKS ==========
Blockly.defineBlocksWithJsonArray([
  {
    "type": "when_i_receive",
    "message0": "when I receive %1",
    "args0": [
      {
        "type": "field_input",
        "name": "EVENT",
        "text": "my_event"
      }
    ],
    "nextStatement": null,
    "colour": "#FFD500",
    "tooltip": "Run blocks when the specified event is broadcast",
    "hat": true
  },
  {
    "type": "broadcast",
    "message0": "broadcast %1",
    "args0": [
      {
        "type": "field_input",
        "name": "EVENT",
        "text": "my_event"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD500",
    "tooltip": "Trigger an event without waiting"
  },
  {
    "type": "broadcast_and_wait",
    "message0": "broadcast %1 and wait",
    "args0": [
      {
        "type": "field_input",
        "name": "EVENT",
        "text": "my_event"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD500",
    "tooltip": "Trigger an event and wait for all handlers to complete"
  }
]);

// ========== NUMBER AND TEXT BLOCKS ==========
Blockly.defineBlocksWithJsonArray([
  {
    "type": "math_number",
    "message0": "%1",
    "args0": [
      { "type": "field_number", "name": "NUM", "value": 0 }
    ],
    "output": "Number",
    "colour": "#40BF4A",
    "tooltip": "A number"
  },
  {
    "type": "text",
    "message0": "%1",
    "args0": [
      { "type": "field_input", "name": "TEXT", "text": "" }
    ],
    "output": "String",
    "colour": "#40BF4A",
    "tooltip": "A text string"
  }
]);

// ========== OPERATORS BLOCKS ==========
Blockly.defineBlocksWithJsonArray([
  {
    "type": "math_operator",
    "message0": "%1 %2 %3",
    "args0": [
      { "type": "input_value", "name": "A", "check": "Number" },
      { "type": "field_dropdown", "name": "OP", "options": [["+", "ADD"], ["-", "SUBTRACT"], ["*", "MULTIPLY"], ["/", "DIVIDE"]] },
      { "type": "input_value", "name": "B", "check": "Number" }
    ],
    "output": "Number",
    "colour": "#40BF4A",
    "tooltip": "Perform basic arithmetic"
  },
  {
    "type": "comparison_operator",
    "message0": "%1 %2 %3",
    "args0": [
      { "type": "input_value", "name": "A" },
      { "type": "field_dropdown", "name": "OP", "options": [["=", "EQ"], ["<", "LT"], ["≤", "LTE"], [">", "GT"], ["≥", "GTE"]] },
      { "type": "input_value", "name": "B" }
    ],
    "output": "Boolean",
    "colour": "#40BF4A",
    "tooltip": "Compare two values"
  },
  {
    "type": "logical_operator",
    "message0": "%1 %2 %3",
    "args0": [
      { "type": "input_value", "name": "A", "check": "Boolean" },
      { "type": "field_dropdown", "name": "OP", "options": [["and", "AND"], ["or", "OR"]] },
      { "type": "input_value", "name": "B", "check": "Boolean" }
    ],
    "output": "Boolean",
    "colour": "#40BF4A",
    "tooltip": "Combine Boolean conditions"
  },
  {
    "type": "not_operator",
    "message0": "not %1",
    "args0": [
      { "type": "input_value", "name": "BOOL", "check": "Boolean" }
    ],
    "output": "Boolean",
    "colour": "#40BF4A",
    "tooltip": "Invert a Boolean value"
  },
  {
    "type": "range_operator",
    "message0": "%1 %2 %3 %4 %5",
    "args0": [
      { "type": "input_value", "name": "LOW", "check": "Number" },
      { "type": "field_dropdown", "name": "LOWOP", "options": [["<", "LT"], ["≤", "LTE"]] },
      { "type": "input_value", "name": "VALUE", "check": "Number" },
      { "type": "field_dropdown", "name": "HIGHOP", "options": [["<", "LT"], ["≤", "LTE"]] },
      { "type": "input_value", "name": "HIGH", "check": "Number" }
    ],
    "output": "Boolean",
    "colour": "#40BF4A",
    "tooltip": "Check if value is within range"
  },
  {
    "type": "pick_random",
    "message0": "pick random %1 to %2",
    "args0": [
      { "type": "field_number", "name": "MIN", "value": 1 },
      { "type": "field_number", "name": "MAX", "value": 10 }
    ],
    "output": "Number",
    "colour": "#40BF4A",
    "tooltip": "Generate random integer"
  },
  {
    "type": "round_number",
    "message0": "round %1 / %2 to %3 decimal places",
    "args0": [
      { "type": "input_value", "name": "NUM", "check": "Number" },
      { "type": "input_value", "name": "DENOM", "check": "Number" },
      { "type": "field_number", "name": "PLACES", "value": 0, "min": 0 }
    ],
    "output": "Number",
    "colour": "#40BF4A",
    "tooltip": "Round number to decimal places"
  },
  {
    "type": "math_functions",
    "message0": "%1 of %2",
    "args0": [
      {
        "type": "field_dropdown", "name": "FUNC", "options": [
          ["abs", "ABS"], ["floor", "FLOOR"], ["ceiling", "CEIL"], ["sqrt", "SQRT"],
          ["sin", "SIN"], ["cos", "COS"], ["tan", "TAN"],
          ["asin", "ASIN"], ["acos", "ACOS"], ["atan", "ATAN"],
          ["ln", "LN"], ["log", "LOG10"], ["e^", "EXP"], ["10^", "POW10"], ["negative", "NEG"]
        ]
      },
      { "type": "input_value", "name": "NUM", "check": "Number" }
    ],
    "output": "Number",
    "colour": "#40BF4A",
    "tooltip": "Apply mathematical function"
  },
  {
    "type": "atan2",
    "message0": "atan2 of x: %1 y: %2",
    "args0": [
      { "type": "input_value", "name": "X", "check": "Number" },
      { "type": "input_value", "name": "Y", "check": "Number" }
    ],
    "output": "Number",
    "colour": "#40BF4A",
    "tooltip": "Inverse tangent of Y/X in degrees"
  },
  {
    "type": "remainder",
    "message0": "remainder of %1 / %2",
    "args0": [
      { "type": "input_value", "name": "DIVIDEND", "check": "Number" },
      { "type": "input_value", "name": "DIVISOR", "check": "Number" }
    ],
    "output": "Number",
    "colour": "#40BF4A",
    "tooltip": "Remainder of division"
  },
  {
    "type": "join",
    "message0": "join %1 %2",
    "args0": [
      { "type": "input_value", "name": "A", "check": "String" },
      { "type": "input_value", "name": "B", "check": "String" }
    ],
    "output": "String",
    "colour": "#40BF4A",
    "tooltip": "Combine two strings"
  },
  {
    "type": "letter",
    "message0": "letter %1 of %2",
    "args0": [
      { "type": "field_number", "name": "POS", "value": 1, "min": 1 },
      { "type": "input_value", "name": "STRING", "check": "String" }
    ],
    "output": "String",
    "colour": "#40BF4A",
    "tooltip": "Get character at position"
  },
  {
    "type": "length",
    "message0": "length of %1",
    "args0": [
      { "type": "input_value", "name": "STRING", "check": "String" }
    ],
    "output": "Number",
    "colour": "#40BF4A",
    "tooltip": "Get string length"
  },
  {
    "type": "contains",
    "message0": "%1 contains %2 ?",
    "args0": [
      { "type": "input_value", "name": "STRING", "check": "String" },
      { "type": "input_value", "name": "SEARCH", "check": "String" }
    ],
    "output": "Boolean",
    "colour": "#40BF4A",
    "tooltip": "Check if string contains substring"
  },
  {
    "type": "convert",
    "message0": "convert %1 to %2",
    "args0": [
      { "type": "input_value", "name": "VALUE" },
      { "type": "field_dropdown", "name": "TYPE", "options": [["text", "TEXT"], ["number", "NUMBER"]] }
    ],
    "output": null,
    "colour": "#40BF4A",
    "tooltip": "Convert value to text or number"
  }
]);

// ========== COMMENT BLOCK ==========
Blockly.defineBlocksWithJsonArray([
  {
    "type": "comment",
    "message0": "💬 %1",
    "args0": [
      { "type": "field_input", "name": "TEXT", "text": "comment" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFFFCC",
    "tooltip": "Add a comment to your code"
  }
]);
