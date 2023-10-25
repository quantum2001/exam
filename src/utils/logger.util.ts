import winston from "winston";
import expressWinston from "express-winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Create the transport for daily rotating log files
const transport = new DailyRotateFile({
  filename: 'logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d', // The duration for keeping the file
  dirname: 'logs',
});

// Creates a logger instance
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [transport],
})
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console())
}

export const expressLogger = expressWinston.logger({ winstonInstance: logger });

export default logger;
