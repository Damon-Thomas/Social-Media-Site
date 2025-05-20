const originalConsoleLog = console.log;
const originalConsoleInfo = console.info;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

function shouldSuppressLog(...args: unknown[]) {
  const logMessage = args.join(" ");
  // Suppress logs that look like Next.js route logs (e.g. "POST  200 in 23ms")
  // or that start with HTTP verbs and status codes
  return (
    /^\s*(GET|POST|PUT|PATCH|DELETE|OPTIONS)\s+\d{3}/.test(logMessage) ||
    /^\s*(GET|POST|PUT|PATCH|DELETE|OPTIONS)\s+/.test(logMessage) ||
    /\s\d{3}\sin\s\d+ms/.test(logMessage)
  );
}

console.log = (...args: unknown[]) => {
  if (shouldSuppressLog(...args)) return;
  originalConsoleLog(...args);
};
console.info = (...args: unknown[]) => {
  if (shouldSuppressLog(...args)) return;
  originalConsoleInfo(...args);
};
console.warn = (...args: unknown[]) => {
  if (shouldSuppressLog(...args)) return;
  originalConsoleWarn(...args);
};
console.error = (...args: unknown[]) => {
  if (shouldSuppressLog(...args)) return;
  originalConsoleError(...args);
};

export {}; // Ensure the file is treated as a module
