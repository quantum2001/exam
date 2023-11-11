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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const answerSchema = new mongoose_1.Schema({
    exam_question: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'ExamQuestion',
    },
    selected_answer: {
        type: String,
    },
});
const examSessionAnswerSchema = new mongoose_1.Schema({
    exam_session_id: {
        type: String,
        required: [true, 'exam session id required'],
    },
    school_id: {
        type: String,
        required: [true, 'school id required'],
    },
    exam_id: {
        type: String,
        required: [true, 'exam id required'],
    },
    student: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Student',
    },
    score: Number,
    graded: {
        type: Boolean,
        default: false,
    },
    answers: [answerSchema],
    created_at: {
        type: Number,
        default: Date.now(),
    },
    updated_at: {
        type: Number,
        default: Date.now(),
        required: true,
    },
});
const Model = (0, mongoose_1.model)('ExamSessionAnswer', examSessionAnswerSchema);
exports.default = Model;
//# sourceMappingURL=exam-session-answer.model.js.map