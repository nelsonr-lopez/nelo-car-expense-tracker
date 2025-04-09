import winston from "winston";
import { config } from "../config";

const { format, createLogger, transports } = winston;

// Define log format
const logFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// Create logger instance
export const logger = createLogger({
  level: config.app.logLevel,
  format: logFormat,
  defaultMeta: { service: config.app.name },
  transports: [
    // Write all logs to console
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    // Write all logs with level 'error' and below to 'error.log'
    new transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs with level 'info' and below to 'combined.log'
    new transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Create a stream object with a 'write' function that will be used by Morgan
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
