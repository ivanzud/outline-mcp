const isStdioMode = process.argv.includes('--stdio');

// Simple logger that outputs to stderr in stdio mode, or stdout/stderr normally
export const logger = {
  log: (...args: any[]) => {
    if (isStdioMode) {
      process.stderr.write(
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'log',
          params: { message: args.join(' ') },
        }) + '\n'
      );
    } else {
      console.log(...args);
    }
  },

  error: (...args: any[]) => {
    if (isStdioMode) {
      process.stderr.write(
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'error',
          params: { message: args.join(' ') },
        }) + '\n'
      );
    } else {
      console.error(...args);
    }
  },

  debug: (...args: any[]) => {
    if (isStdioMode) {
      process.stderr.write(
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'debug',
          params: { message: args.join(' ') },
        }) + '\n'
      );
    } else {
      console.debug(...args);
    }
  },
};
