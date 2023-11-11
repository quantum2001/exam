"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySchool = exports.verifyAdmin = exports.verifyStudent = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const verifyStudent = (req, res, next) => {
    var _a;
    const token = req.headers['authorization'];
    const decoded = (0, jwt_util_1.verifyJWT)((_a = token === null || token === void 0 ? void 0 : token.split(' ')[1]) !== null && _a !== void 0 ? _a : '');
    if (decoded) {
        if (decoded.type === 'student' && decoded.iss === 'krendus-exam-server') {
            req.user = decoded.data;
            next();
        }
        else {
            res.status(401).json({
                message: 'Unauthorized',
                data: null,
                status: 'error',
            });
        }
    }
    else {
        res.status(401).json({
            message: 'Unauthorized',
            data: null,
            status: 'error',
        });
    }
};
exports.verifyStudent = verifyStudent;
const verifyAdmin = (req, res, next) => {
    var _a;
    const token = req.headers['authorization'];
    const decoded = (0, jwt_util_1.verifyJWT)((_a = token === null || token === void 0 ? void 0 : token.split(' ')[1]) !== null && _a !== void 0 ? _a : '');
    if (decoded) {
        if (decoded.type === 'admin' && decoded.iss === 'krendus-exam-server') {
            next();
        }
        else {
            res.status(401).json({
                message: 'Unauthorized',
                data: null,
                status: 'error',
            });
        }
    }
    else {
        res.status(401).json({
            message: 'Unauthorized',
            data: null,
            status: 'error',
        });
    }
};
exports.verifyAdmin = verifyAdmin;
const verifySchool = (req, res, next) => {
    var _a;
    const token = req.headers['authorization'];
    const decoded = (0, jwt_util_1.verifyJWT)((_a = token === null || token === void 0 ? void 0 : token.split(' ')[1]) !== null && _a !== void 0 ? _a : '');
    if (decoded) {
        if (decoded.type === 'school' && decoded.iss === 'krendus-exam-server') {
            req.user = decoded.data;
            next();
        }
        else {
            res.status(401).json({
                message: 'Unauthorized',
                data: null,
                status: 'error',
            });
        }
    }
    else {
        res.status(401).json({
            message: 'Unauthorized',
            data: null,
            status: 'error',
        });
    }
};
exports.verifySchool = verifySchool;
//# sourceMappingURL=auth.middleware.js.map