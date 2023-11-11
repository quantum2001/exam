"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanUp = exports.generateAlphanumericPassword = exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// Hashing of password
const hashPassword = (password) => {
    const saltRounds = 10;
    return bcrypt_1.default.hash(password, saltRounds);
};
exports.hashPassword = hashPassword;
// Comparing of password
const comparePassword = (password, hash) => {
    return bcrypt_1.default.compare(password, hash);
};
exports.comparePassword = comparePassword;
const generateAlphanumericPassword = (length) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }
    return password;
};
exports.generateAlphanumericPassword = generateAlphanumericPassword;
const cleanUp = (doc) => {
    const obj = doc.toObject();
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    return obj;
};
exports.cleanUp = cleanUp;
//# sourceMappingURL=helpers.util.js.map