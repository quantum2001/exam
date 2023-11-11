"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const routes_1 = require("./routes");
const logger_util_1 = __importStar(require("./utils/logger.util"));
const db_util_1 = require("./utils/db.util");
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const socket_controller_1 = require("./controllers/socket.controller");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
(0, socket_controller_1.examSocketController)(io);
const port = process.env.PORT || 5000;
app.use(logger_util_1.expressLogger);
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/api/v1', routes_1.v1Router);
async function startServer() {
    try {
        await (0, db_util_1.connectsDB)();
        server.listen(port, () => {
            logger_util_1.default.info(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        logger_util_1.default.error('Error starting server: ', error);
    }
}
startServer();
//# sourceMappingURL=app.js.map