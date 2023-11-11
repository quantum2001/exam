"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const examSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'exam name required'],
    },
    school_id: {
        type: String,
        required: [true, 'school id required'],
    },
    to_answer: {
        type: Number,
        required: true,
    },
    is_available: {
        type: Boolean,
        required: true,
        default: false,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: [true, 'duration required'],
    },
    created_at: {
        type: Number,
        required: true,
        default: Date.now(),
    },
    updated_at: {
        type: Number,
        required: true,
        default: Date.now(),
    },
    class_id: {
        type: String,
        required: true,
    },
});
const Model = (0, mongoose_1.model)('Exam', examSchema);
exports.default = Model;
//# sourceMappingURL=exam.model.js.map