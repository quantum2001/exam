"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectsDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_util_1 = __importDefault(require("./logger.util"));
async function connectsDB() {
    const dbURI = process.env.MONGO_URI || '';
    try {
        await mongoose_1.default.connect(dbURI);
        logger_util_1.default.info('Connected to MongoDB');
    }
    catch (error) {
        logger_util_1.default.error('Error connecting to MongoDB: ', error);
        throw new Error('Error connecting to MongoDB');
    }
}
exports.connectsDB = connectsDB;
//# sourceMappingURL=db.util.js.map