"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const examQuestionSchema = new mongoose_1.Schema({
    exam_id: {
        required: [true, 'exam id required'],
        type: String,
    },
    school_id: {
        required: [true, 'school id required'],
        type: String,
    },
    question: {
        required: [true, 'exam question required'],
        type: String,
    },
    image: String,
    type: {
        type: String,
        required: [true, 'question type required'],
        enum: ['german', 'option'],
    },
    answer: {
        required: [true, 'answer required'],
        type: String,
    },
    options: {
        type: [String],
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
});
const Model = (0, mongoose_1.model)('ExamQuestion', examQuestionSchema);
exports.default = Model;
//# sourceMappingURL=exam-question.model.js.map