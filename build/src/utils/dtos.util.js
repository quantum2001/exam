"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, data, message, statusCode, status) => {
    res.status(statusCode).send({
        message,
        data,
        status,
    });
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=dtos.util.js.map