"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const express_winston_1 = __importDefault(require("express-winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
// Create the transport for daily rotating log files
const transport = new winston_daily_rotate_file_1.default({
    filename: 'logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    dirname: 'logs',
});
// Creates a logger instance
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [transport],
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console());
}
exports.expressLogger = express_winston_1.default.logger({ winstonInstance: logger });
exports.default = logger;
//# sourceMappingURL=logger.util.js.map