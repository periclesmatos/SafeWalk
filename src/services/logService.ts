type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: Record<string, any>;
}

const logs: LogEntry[] = [];
const MAX_LOGS = 100;

const getTimestamp = (): string => {
  return new Date().toISOString();
};

const addLog = (level: LogLevel, context: string, message: string, data?: Record<string, any>) => {
  const entry: LogEntry = {
    timestamp: getTimestamp(),
    level,
    context,
    message,
    data,
  };

  logs.push(entry);
  if (logs.length > MAX_LOGS) {
    logs.shift();
  }

  // Console output em dev
  if (__DEV__) {
    const logFn = level === 'ERROR' ? console.error : level === 'WARN' ? console.warn : console.log;
    logFn(`[${level}] ${context}: ${message}`, data || '');
  }
};

export const logService = {
  debug: (context: string, message: string, data?: Record<string, any>) => {
    addLog('DEBUG', context, message, data);
  },

  info: (context: string, message: string, data?: Record<string, any>) => {
    addLog('INFO', context, message, data);
  },

  warn: (context: string, message: string, data?: Record<string, any>) => {
    addLog('WARN', context, message, data);
  },

  error: (context: string, message: string, error?: Error | Record<string, any>) => {
    const data = error instanceof Error ? { error: error.message, stack: error.stack } : error;
    addLog('ERROR', context, message, data);
  },

  getLogs: (): LogEntry[] => [...logs],

  clearLogs: () => {
    logs.length = 0;
  },

  exportLogs: (): string => {
    return JSON.stringify(logs, null, 2);
  },
};

// Para debug: tornar acessível globalmente
if (__DEV__) {
  (global as any).logs = logService;
}
