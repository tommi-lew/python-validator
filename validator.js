function validate(lines) {
  // Track indentation levels using a stack
  const indentationStack = [0];

  let lineIndex = 0;
  let prevLineIndentation = 0;
  let prevLineWasConditional = false;

  for (const line of lines) {
    console.log("lineIndex: " + lineIndex);

    // Skip empty lines
    if (line.trim() === "") {
      continue;
    }

    // Calculate indentation level
    const indentation = line.length - line.trimLeft().length;

    // Rule 1: First line is not indented
    if (lineIndex === 0 && indentation !== 0) {
      console.log("failed Rule 1");
      return {
        success: false,
        lineIndex: lineIndex,
      };
    }

    // Check if the line is a conditional statement
    const isConditional = line.trim().endsWith(":");

    // Handle block exit (indentation decreased)
    if (indentation < prevLineIndentation) {
      // Pop all blocks that have ended
      while (
        indentationStack.length > 1 &&
        indentationStack[indentationStack.length - 1] > indentation
      ) {
        indentationStack.pop();
      }

      let rule3b = false;

      // Check if current indentation matches any valid indentation level
      if (!indentationStack.includes(indentation)) {
        console.log("failed Rule 3B");
        return {
          success: false,
          lineIndex: lineIndex,
        }; // Rule 3B
      } else {
        rule3b = true;
      }

      // Rule 3: Line after non-conditional statement should be aligned to either:
      // 3a: Previous line
      if (
        !rule3b &&
        !prevLineWasConditional &&
        indentation !== prevLineIndentation
      ) {
        console.log("!prevLineWasConditional: " + !prevLineWasConditional);
        console.log(
          "indentation !== prevLineIndentation: " +
            (indentation !== prevLineIndentation)
        );

        console.log("failed Rule 3A");
        return {
          success: false,
          lineIndex: lineIndex,
        };
      }
    }

    // Rule 2: Line after conditional statement should be further indented at least by 1 space
    if (prevLineWasConditional && indentation <= prevLineIndentation) {
      console.log("failed Rule 2");
      return {
        success: false,
        lineIndex: lineIndex,
      };
    }

    // Update the stack if this is the first line of a new block
    if (prevLineWasConditional && indentation > prevLineIndentation) {
      indentationStack.push(indentation);
    }

    // Update state for next iteration
    prevLineIndentation = indentation;
    prevLineWasConditional = isConditional;
    lineIndex++;
  }

  return {
    success: true,
    lineIndex: lineIndex,
  };
}

function lineAfterNonConditional() {}

function main() {
  const pythonLines = [
    "",
    'print("Hello!")',
    'if s == "music":',
    '    print("Dance now!")',
    "    if i % 2 == 0:",
    '        print("Turn up!")',
    "    else:",
    '        print("So funny!")',
    '        print("Love it!")',
    'print("Goodbye!")',
  ];

  const result = validate(pythonLines);
  console.log("Result: ", result);
}

main();
