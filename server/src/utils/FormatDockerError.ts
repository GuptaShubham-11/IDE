export const FormatDockerError = (errorLog: string): string => {
  // Detect common JavaScript / Python / other errors
  const errorMatch = errorLog.match(
    /(SyntaxError|ReferenceError|TypeError|NameError|IndentationError|Exception): (.+)/
  );
  if (errorMatch) {
    const [, errorType, message] = errorMatch;

    // Try to extract file and line number info
    const lineMatch = errorLog.match(
      /program\.(js|py|c|cpp|java|go|php):(\d+)/
    );
    const lineInfo = lineMatch ? ` at line ${lineMatch[2]}` : '';

    return `${errorType}: ${message}${lineInfo}`;
  }

  // Detect compilation errors (C/C++/Java/Go)
  const compileErrorMatch = errorLog.match(/error: (.+)/);
  if (compileErrorMatch) {
    return `Compilation Error: ${compileErrorMatch[1]}`;
  }

  // Detect runtime errors without a known error type
  const runtimeErrorMatch = errorLog.match(/(Error|Exception): (.+)/);
  if (runtimeErrorMatch) {
    const [, errorType, message] = runtimeErrorMatch;
    return `${errorType}: ${message}`;
  }

  // If no known error pattern is detected
  return 'An unknown error occurred while running the code.';
};
