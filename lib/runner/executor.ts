export type ConsoleLogEntry = {
  type: "log" | "info" | "warn" | "error" | "result";
  content: string;
};

export type ExecutionResult = {
  logs: ConsoleLogEntry[];
  error?: string;
  executionTimeMs: number;
};

// Lightweight TypeScript type stripper for browser worker execution
function stripTypeScript(code: string): string {
  return code
    // Remove type alias definitions: type X = ...;
    .replace(/^\s*type\s+\w+.*$/gm, "")
    // Remove interface definitions: interface X { ... }
    .replace(/^\s*interface\s+\w+[\s\S]*?\n\}/gm, "")
    // Remove type annotations from function parameters & variables: name: Type
    .replace(/:\s*([A-Za-z0-9_<>\[\]|&\s]+)(?=[,)=;{])/g, "")
    // Remove return type annotations: ): Type {
    .replace(/\):\s*([A-Za-z0-9_<>\[\]|&\s]+)\s*\{/g, ") {")
    // Remove generic parameters: <T>
    .replace(/<[A-Za-z0-9_,\s]+>/g, "");
}

export function executeCode(
  code: string,
  language: "javascript" | "typescript"
): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof Worker === "undefined") {
      resolve({
        logs: [],
        error: "Code execution is only supported in the browser environment.",
        executionTimeMs: 0,
      });
      return;
    }

    const jsCode = language === "typescript" ? stripTypeScript(code) : code;

    const workerScript = `
      self.onmessage = function(e) {
        const logs = [];

        function formatArg(arg) {
          if (arg === null) return 'null';
          if (arg === undefined) return 'undefined';
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg, null, 2);
            } catch(e) {
              return String(arg);
            }
          }
          return String(arg);
        }

        console.log = function(...args) {
          logs.push({ type: 'log', content: args.map(formatArg).join(' ') });
        };
        console.info = function(...args) {
          logs.push({ type: 'info', content: args.map(formatArg).join(' ') });
        };
        console.warn = function(...args) {
          logs.push({ type: 'warn', content: args.map(formatArg).join(' ') });
        };
        console.error = function(...args) {
          logs.push({ type: 'error', content: args.map(formatArg).join(' ') });
        };

        const startTime = performance.now();
        try {
          // Use Function constructor for isolated execution scope
          const resultFn = new Function(e.data.code);
          const res = resultFn();
          if (res !== undefined) {
            logs.push({ type: 'result', content: '=> ' + formatArg(res) });
          }
          const endTime = performance.now();
          self.postMessage({
            status: 'success',
            logs: logs,
            executionTimeMs: Math.round((endTime - startTime) * 10) / 10
          });
        } catch (err) {
          const endTime = performance.now();
          self.postMessage({
            status: 'error',
            logs: logs,
            error: err.stack || err.message || String(err),
            executionTimeMs: Math.round((endTime - startTime) * 10) / 10
          });
        }
      };
    `;

    const blob = new Blob([workerScript], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));

    let settled = false;

    // 3 second execution timeout
    const timeoutTimer = setTimeout(() => {
      if (!settled) {
        settled = true;
        worker.terminate();
        resolve({
          logs: [],
          error: "Execution timed out after 3000ms (possible infinite loop).",
          executionTimeMs: 3000,
        });
      }
    }, 3000);

    worker.onmessage = (event) => {
      if (!settled) {
        settled = true;
        clearTimeout(timeoutTimer);
        worker.terminate();
        resolve({
          logs: event.data.logs || [],
          error: event.data.error,
          executionTimeMs: event.data.executionTimeMs || 0,
        });
      }
    };

    worker.onerror = (err) => {
      if (!settled) {
        settled = true;
        clearTimeout(timeoutTimer);
        worker.terminate();
        resolve({
          logs: [],
          error: err.message || "Uncaught worker execution error.",
          executionTimeMs: 0,
        });
      }
    };

    worker.postMessage({ code: jsCode });
  });
}
