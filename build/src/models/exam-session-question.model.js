"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const questionSchema = new mongoose_1.Schema({
    question_id: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['german', 'option'],
    },
    options: [String],
});
const examSessionQuestionSchema = new mongoose_1.Schema({
    exam_session_id: String,
    questions: [questionSchema],
    created_at: {
        type: Number,
        default: Date.now(),
    },
});
const Model = (0, mongoose_1.model)('ExamSessionQuestion', examSessionQuestionSchema);
exports.default = Model;
//# sourceMappingURL=exam-session-question.model.js.map