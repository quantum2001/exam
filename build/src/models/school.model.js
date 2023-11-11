"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schoolSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'school name required'],
    },
    address: {
        type: String,
        required: [true, 'address required'],
    },
    email: {
        type: String,
        required: [true, 'email required'],
        unique: true,
    },
    logo: {
        type: String,
        requred: true,
    },
    exam_limit: {
        type: Number,
        default: 1,
    },
    is_disabled: {
        type: Boolean,
        default: true,
    },
    created_at: {
        type: Number,
        default: Date.now(),
        required: true,
    },
    password: {
        type: String,
        required: [true, 'password required'],
    },
    updated_at: {
        type: Number,
        required: true,
        default: Date.now(),
    },
});
const Model = (0, mongoose_1.model)('School', schoolSchema);
exports.default = Model;
//# sourceMappingURL=school.model.js.map