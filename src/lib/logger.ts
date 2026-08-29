const isProduction = process.env.NODE_ENV === "production";

type LogLevel = "log" | "info" | "warn" | "error";

function formatMessage(level: LogLevel, ...args: unknown[]) {
  return args;
}

export const logger = {
  log: (...args: unknown[]) => {
    if (!isProduction) {
      console.log(...formatMessage("log", ...args));
    }
  },
  info: (...args: unknown[]) => {
    if (!isProduction) {
      console.info(...formatMessage("info", ...args));
    }
  },
  warn: (...args: unknown[]) => {
    console.warn(...formatMessage("warn", ...args));
  },
  error: (...args: unknown[]) => {
    console.error(...formatMessage("error", ...args));
  },
};

export default logger;
