"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.signJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Sign jwt
const signJWT = (data, type) => {
    const secretKey = process.env.SECRET_KEY || '';
    const payload = {
        data,
        type,
        iat: Math.floor(Date.now() / 1000),
        // exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        iss: 'krendus-exam-server',
    };
    return jsonwebtoken_1.default.sign(payload, secretKey);
};
exports.signJWT = signJWT;
// Verify jwt
const verifyJWT = (token) => {
    const secretKey = process.env.SECRET_KEY || '';
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        return decoded;
    }
    catch (e) {
        return null;
    }
};
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=jwt.util.js.map